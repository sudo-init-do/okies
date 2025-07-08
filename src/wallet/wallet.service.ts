// src/wallet/wallet.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { UserProfile } from 'src/firestore/types/user-profile.type';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class WalletService {
  constructor(private readonly firebase: FirebaseService) {}

  /* ── current balance ── */
  async getBalance(uid: string) {
    const profile = await this.firebase.getDocument<UserProfile>('users', uid);
    if (!profile) throw new NotFoundException('User not found');
    return { coins: profile.coins ?? 0 };
  }

  /* ── request withdrawal ── */
  async requestWithdrawal(uid: string, dto: WithdrawDto) {
    const profile = await this.firebase.getDocument<UserProfile>('users', uid);
    if (!profile) throw new NotFoundException('User not found');

    const currentCoins = profile.coins ?? 0;           // ✅ safe default
    if (currentCoins < dto.amount)
      throw new BadRequestException('Insufficient balance');

    // deduct coins atomically
    await this.firebase.updateDocument('users', uid, {
      coins: currentCoins - dto.amount,
    });

    // store withdrawal request
    await this.firebase.db.collection('withdrawals').add({
      uid,
      amount: dto.amount,
      destination: dto.destination,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    });

    return { message: 'Withdrawal request submitted' };
  }

  /* ── paginated history ── */
  async getTransactions(uid: string, limit = 20, cursor?: string) {
    let ref = this.firebase.db
      .collection('withdrawals')
      .where('uid', '==', uid)
      .orderBy('requestedAt', 'desc')
      .limit(limit);

    if (cursor) {
      const snap = await this.firebase.db.collection('withdrawals').doc(cursor).get();
      if (snap.exists) ref = ref.startAfter(snap);
    }

    const snap = await ref.get();
    const transactions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { transactions, nextCursor: transactions.at(-1)?.id ?? null };
  }
}
