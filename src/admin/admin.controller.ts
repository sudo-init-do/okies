// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FirebaseService } from 'src/firestore/firebase.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard) // user must be authenticated & admin
export class AdminController {
  constructor(private readonly firebase: FirebaseService) {}

  /* ── Dashboard totals ───────────────────────────────────────────── */
  @Get('stats')
  async getStats() {
    const [u, p, g, w] = await Promise.all([
      this.firebase.db.collection('users').count().get(),
      this.firebase.db.collection('posts').count().get(),
      this.firebase.db.collection('gifts').count().get(),
      this.firebase.db.collection('withdrawals').count().get(),
    ]);

    return {
      totalUsers:       u.data().count,
      totalPosts:       p.data().count,
      totalGifts:       g.data().count,
      totalWithdrawals: w.data().count,
    };
  }

  /* ── User directory ─────────────────────────────────────────────── */
  @Get('users')
  async listUsers(
    @Query('limit',  new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    let ref = this.firebase.db
      .collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      const cur = await this.firebase.db.collection('users').doc(cursor).get();
      if (cur.exists) ref = ref.startAfter(cur);
    }

    const snap  = await ref.get();
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { users, nextCursor: users.at(-1)?.id ?? null };
  }

  /* ── Withdrawals list ───────────────────────────────────────────── */
  @Get('withdrawals')
  async getWithdrawals(@Query('status') status?: string) {
    let ref = this.firebase.db
      .collection('withdrawals')
      .orderBy('requestedAt', 'desc');

    if (status) ref = ref.where('status', '==', status);

    const snap = await ref.get();
    return { withdrawals: snap.docs.map(d => ({ id: d.id, ...d.data() })) };
  }

  /* ── Approve / Reject ───────────────────────────────────────────── */
  @Post('withdrawals/:id/approve')
  async approve(@Param('id') id: string) {
    const ref  = this.firebase.db.collection('withdrawals').doc(id);
    const snap = await ref.get();

    if (!snap.exists)                      throw new NotFoundException('Withdrawal not found');
    if (snap.data()?.status !== 'pending') throw new BadRequestException('Already processed');

    await ref.update({
      status:     'approved',
      reviewedAt: new Date().toISOString(),
    });
    return { message: 'Withdrawal approved' };
  }

  @Post('withdrawals/:id/reject')
  async reject(@Param('id') id: string) {
    const ref  = this.firebase.db.collection('withdrawals').doc(id);
    const snap = await ref.get();

    if (!snap.exists)                      throw new NotFoundException('Withdrawal not found');
    if (snap.data()?.status !== 'pending') throw new BadRequestException('Already processed');

    await ref.update({
      status:     'rejected',
      reviewedAt: new Date().toISOString(),
    });
    return { message: 'Withdrawal rejected' };
  }
}
