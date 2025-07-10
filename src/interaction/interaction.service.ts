import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import {
  FieldValue,
  Timestamp,
} from 'firebase-admin/firestore';

import { FirebaseService } from 'src/firestore/firebase.service';
import { GIFT_CATALOG }    from './gift-types.const';
import { SendGiftDto }     from './dto/send-gift.dto';

const GIFT_COOLDOWN_MS = 5_000;

@Injectable()
export class InteractionService {
  constructor(private readonly firebase: FirebaseService) {}

  /* ───────────────────── Likes ───────────────────── */
  async likePost(postId: string, uid: string): Promise<void> {
    if (!postId || !uid) throw new BadRequestException('Missing postId or uid');

    const likeRef = this.firebase.db
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(uid);

    if ((await likeRef.get()).exists) {
      throw new BadRequestException('You already liked this post');
    }

    await likeRef.set({ likedAt: Timestamp.now() });
    await this.firebase.db
      .collection('posts')
      .doc(postId)
      .update({ likeCount: FieldValue.increment(1) });
  }

  async unlikePost(postId: string, uid: string): Promise<void> {
    if (!postId || !uid) throw new BadRequestException('Missing postId or uid');

    const likeRef = this.firebase.db
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(uid);

    if (!(await likeRef.get()).exists) {
      throw new BadRequestException('You have not liked this post yet');
    }

    await likeRef.delete();
    await this.firebase.db
      .collection('posts')
      .doc(postId)
      .update({ likeCount: FieldValue.increment(-1) });
  }

  /* ───────────────────── Comments ───────────────────── */
  async commentOnPost(
    postId: string,
    uid: string,
    text: string,
    parentId?: string,
  ): Promise<string> {
    if (!text || !uid || !postId) throw new BadRequestException('Missing data');

    return this.firebase.addDocument(`posts/${postId}/comments`, {
      uid,
      text,
      parentId: parentId ?? null,
      createdAt: Timestamp.now(),
    });
  }

  async getCommentsForPost(
    postId: string,
    limit: number,
    cursorId?: string,
    parentId?: string,
  ) {
    let ref = this.firebase.db
      .collection(`posts/${postId}/comments`)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (parentId) ref = ref.where('parentId', '==', parentId);

    if (cursorId) {
      const cursorSnap = await this.firebase.db
        .collection(`posts/${postId}/comments`)
        .doc(cursorId)
        .get();
      if (cursorSnap.exists) ref = ref.startAfter(cursorSnap);
    }

    const snap = await ref.get();
    const comments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return {
      comments,
      nextCursor: comments.length ? comments.at(-1)!.id : null,
    };
  }

  /* ─────────────── Gift w/ Deduction & Cooldown ─────────────── */
  async sendGift(
    postId: string,
    senderUid: string,
    giftType: SendGiftDto['giftType'],
    amount: number,
  ): Promise<string> {
    if (!postId.trim()) throw new BadRequestException('postId cannot be empty');
    if (!senderUid) throw new BadRequestException('Missing senderUid');
    if (!(giftType in GIFT_CATALOG))
      throw new BadRequestException('Unknown gift type');
    if (amount < 1) throw new BadRequestException('Amount must be at least 1');

    const post = await this.firebase.getDocument<{ uid: string }>('posts', postId);
    if (!post?.uid) throw new BadRequestException('Post not found');
    const receiverUid = post.uid;

    // Cooldown check
    const latest = await this.firebase.db
      .collection(`posts/${postId}/gifts`)
      .where('senderUid', '==', senderUid)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (!latest.empty) {
      const diff = Date.now() - (latest.docs[0].data().createdAt as Timestamp).toMillis();
      if (diff < GIFT_COOLDOWN_MS) {
        throw new BadRequestException(
          `Slow down – wait ${(GIFT_COOLDOWN_MS - diff) / 1000}s.`,
        );
      }
    }

    const unitPrice  = GIFT_CATALOG[giftType];
    const totalPrice = unitPrice * amount;

    const giftId = await this.firebase.db.runTransaction(async (tx) => {
      const senderRef   = this.firebase.db.collection('users').doc(senderUid);
      const receiverRef = this.firebase.db.collection('users').doc(receiverUid);
      const giftsCol    = this.firebase.db.collection(`posts/${postId}/gifts`);
      const logCol      = this.firebase.db.collection('wallet_transactions');

      const senderSnap  = await tx.get(senderRef);
      const senderCoins = (senderSnap.data()?.coins as number) ?? 0;
      if (senderCoins < totalPrice)
        throw new BadRequestException('Insufficient balance');

      // Debit sender, credit receiver
      tx.update(senderRef,   { coins: senderCoins - totalPrice });
      tx.set(receiverRef,    { coins: FieldValue.increment(totalPrice) }, { merge: true });

      // Create gift
      const newGiftRef = giftsCol.doc();
      tx.set(newGiftRef, {
        postId,
        senderUid,
        receiverUid,
        giftType,
        amount,
        value: totalPrice,
        createdAt: Timestamp.now(),
      });

      // Log wallet transaction
      tx.set(logCol.doc(), {
        uid: senderUid,
        type: 'gift',
        direction: 'debit',
        amount: totalPrice,
        coinsAfter: senderCoins - totalPrice,
        ref: newGiftRef.id,
        createdAt: Timestamp.now(),
      });

      return newGiftRef.id;
    });

    return giftId;
  }

  /* ───────────────────── Leaderboard / Earnings ───────────────────── */
  async getGiftLeaderboard(postId: string, limit = 10) {
    const snap = await this.firebase.db
      .collection(`posts/${postId}/gifts`)
      .orderBy('value', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async getUserEarnings(uid: string) {
    if (!uid) throw new BadRequestException('Missing user ID');
    const user = await this.firebase.getDocument<{ coins?: number }>('users', uid);
    return { coins: user?.coins ?? 0 };
  }
}
