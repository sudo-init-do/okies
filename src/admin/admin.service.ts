import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';

@Injectable()
export class AdminService {
  constructor(private readonly firebase: FirebaseService) {}

  async getStats() {
    const [users, posts, gifts, withdrawals] = await Promise.all([
      this.firebase.db.collection('users').count().get(),
      this.firebase.db.collection('posts').count().get(),
      this.firebase.db.collectionGroup('gifts').count().get(),
      this.firebase.db.collection('withdrawals').count().get(),
    ]);

    return {
      totalUsers: users.data().count,
      totalPosts: posts.data().count,
      totalGifts: gifts.data().count,
      totalWithdrawals: withdrawals.data().count,
    };
  }

  async getTopUpLogs() {
    try {
      const snapshot = await this.firebase.db
        .collectionGroup('topups')
        .orderBy('timestamp', 'desc')
        .orderBy('txRef', 'asc') // forces index generation
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const userId = doc.ref.parent.parent?.id;
        return {
          userId,
          txRef: data.txRef,
          coinAmount: data.coinAmount,
          amount: data.amount,
          gateway: data.gateway,
          status: data.status,
          timestamp: data.timestamp,
        };
      });
    } catch (error) {
      console.error('❗️Firestore index might be missing:');
      console.error(error.message || error);
      throw new InternalServerErrorException('Failed to fetch top-up logs');
    }
  }

  async getAllUsers(limit = 50, cursor?: string) {
    let ref = this.firebase.db
      .collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      const snap = await this.firebase.db.collection('users').doc(cursor).get();
      if (snap.exists) ref = ref.startAfter(snap);
    }

    const snap = await ref.get();
    const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return {
      users,
      nextCursor: users.at(-1)?.id ?? null,
    };
  }

  async getWithdrawals(status?: string) {
    let ref = this.firebase.db
      .collection('withdrawals')
      .orderBy('requestedAt', 'desc');

    if (status) ref = ref.where('status', '==', status);

    const snap = await ref.get();
    return {
      withdrawals: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    };
  }

  async processWithdrawal(id: string, action: 'approved' | 'rejected') {
    const ref = this.firebase.db.collection('withdrawals').doc(id);
    const snap = await ref.get();

    if (!snap.exists) throw new NotFoundException('Withdrawal not found');
    if (snap.data()?.status !== 'pending') {
      throw new BadRequestException('Already processed');
    }

    await ref.update({
      status: action,
      reviewedAt: new Date().toISOString(),
    });

    return { message: `Withdrawal ${action}` };
  }
}
