import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FirebaseService } from 'src/firestore/firebase.service';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';

@Controller('withdrawals')
@UseGuards(AuthGuard)
export class WithdrawalsController {
  constructor(private readonly firebase: FirebaseService) {}

  @Post('request')
  async requestWithdrawal(
    @Req() req: AuthenticatedRequest,
    @Body('amount') amount: number,
  ) {
    const uid = req.user?.uid;
    if (!uid) throw new BadRequestException('Missing user');

    if (amount < 1) {
      throw new BadRequestException('Minimum withdrawal is 1 coin');
    }

    const user = await this.firebase.getDocument<{ coins?: number }>(
      'users',
      uid,
    );
    const currentCoins = user?.coins ?? 0;
    if (currentCoins < amount) {
      throw new BadRequestException('Insufficient coins');
    }

    const id = await this.firebase.addDocument('withdrawals', {
      uid,
      amount,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    });

    await this.firebase.setDocument('users', uid, {
      coins: currentCoins - amount,
    });

    return { message: 'Withdrawal requested', withdrawalId: id };
  }

  @Get('my')
  async getMyWithdrawals(@Req() req: AuthenticatedRequest) {
    const uid = req.user?.uid;
    const snap = await this.firebase.db
      .collection('withdrawals')
      .where('uid', '==', uid)
      .orderBy('requestedAt', 'desc')
      .get();

    const withdrawals = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { withdrawals };
  }
}
