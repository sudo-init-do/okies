// src/wallet/wallet.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { UserProfile } from 'src/firestore/types/user-profile.type';
import { WithdrawDto } from './dto/withdraw.dto';
import { FieldValue } from 'firebase-admin/firestore';

const COIN_RATE = 10;           // ₦10  → 1 coin  (₦1000 → 100 coins)

@Injectable()
export class WalletService {
  constructor(private readonly firebase: FirebaseService) {}

  /* ─────────── Current balance ─────────── */
  async getBalance(uid: string) {
    const profile = await this.firebase.getDocument<UserProfile>('users', uid);
    if (!profile) throw new NotFoundException('User not found');
    return { coins: profile.coins ?? 0 };
  }

  /* ─────────── Withdraw ─────────── */
  async requestWithdrawal(uid: string, dto: WithdrawDto) {
    const profile = await this.firebase.getDocument<UserProfile>('users', uid);
    if (!profile) throw new NotFoundException('User not found');

    const currentCoins = profile.coins ?? 0;
    if (currentCoins < dto.amount)
      throw new BadRequestException('Insufficient balance');

    /* atomic coin-deduction + withdrawal record in a tx */
    await this.firebase.db.runTransaction(async (tx) => {
      const userRef = this.firebase.db.collection('users').doc(uid);

      tx.update(userRef, {
        coins: FieldValue.increment(-dto.amount),
      });

      tx.set(
        this.firebase.db.collection('withdrawals').doc(),
        {
          uid,
          amount: dto.amount,
          destination: dto.destination,
          status: 'pending',
          requestedAt: new Date().toISOString(),
        },
        { merge: false },
      );
    });

    return { message: 'Withdrawal request submitted' };
  }

  /* ─────────── Top-up (manual) ─────────── */
  async topupWallet(uid: string, nairaAmount: number) {
    if (!uid || nairaAmount <= 0) {
      throw new BadRequestException('Invalid uid or amount');
    }

    const coins = Math.floor(nairaAmount / COIN_RATE);

    await this.firebase.db
      .collection('users')
      .doc(uid)
      .update({ coins: FieldValue.increment(coins) });

    return {
      message: `Wallet topped up with ${coins} coins`,
      coinsAdded: coins,
    };
  }

  /* ─────────── Paginated history ─────────── */
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
