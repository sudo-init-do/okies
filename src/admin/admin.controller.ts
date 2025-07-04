import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FieldValue } from 'firebase-admin/firestore';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly firebaseService: FirebaseService) {}

  /* ───────────── Promote to Admin ───────────── */
  @Post('promote')
  @Roles('admin')
  async promoteToAdmin(
    @Body('uid') uid: string,
    @Body('secret') secret: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (secret !== process.env.ADMIN_PROMOTE_SECRET) {
      throw new ForbiddenException('Unauthorized promotion attempt');
    }

    const targetUid = uid || req.user?.uid;
    if (!targetUid) {
      throw new ForbiddenException('User ID is required');
    }

    await this.firebaseService.updateDocument('users', targetUid, {
      role: 'admin',
    });

    return { message: `User ${targetUid} promoted to admin` };
  }

  /* ───────────── View All Withdrawals ───────────── */
  @Get('withdrawals')
  @Roles('admin')
  async getAllWithdrawals(@Query('status') status?: string) {
    let ref = this.firebaseService.db
      .collection('withdrawals')
      .orderBy('requestedAt', 'desc');

    if (status) {
      ref = ref.where('status', '==', status);
    }

    const snap = await ref.get();
    const withdrawals = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { withdrawals };
  }

  /* ───────────── Approve Withdrawal ───────────── */
  @Post('withdrawals/:id/approve')
  @Roles('admin')
  async approveWithdrawal(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const ref = this.firebaseService.db.collection('withdrawals').doc(id);
    const doc = await ref.get();

    if (!doc.exists) throw new NotFoundException('Withdrawal not found');
    const data = doc.data();

    if (data?.status !== 'pending') {
      throw new BadRequestException('Withdrawal already processed');
    }

    await ref.update({
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewerUid: req.user?.uid ?? null,
    });

    return { message: 'Withdrawal approved' };
  }

  /* ───────────── Reject Withdrawal & Refund ───────────── */
  @Post('withdrawals/:id/reject')
  @Roles('admin')
  async rejectWithdrawal(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const ref = this.firebaseService.db.collection('withdrawals').doc(id);
    const doc = await ref.get();

    if (!doc.exists) throw new NotFoundException('Withdrawal not found');
    const data = doc.data();

    if (!data?.uid || !data?.amount) {
      throw new BadRequestException('Invalid withdrawal data');
    }

    if (data.status !== 'pending') {
      throw new BadRequestException('Withdrawal already processed');
    }

    const userRef = this.firebaseService.db
      .collection('users')
      .doc(String(data.uid));

    await this.firebaseService.db.runTransaction((tx) => {
      tx.update(ref, {
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewerUid: req.user?.uid ?? null,
      });

      tx.update(userRef, {
        coins: FieldValue.increment(Number(data.amount)),
      });

      return Promise.resolve(true);
    });

    return { message: 'Withdrawal rejected and coins refunded' };
  }
}
