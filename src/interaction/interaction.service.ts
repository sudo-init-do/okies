import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { GIFT_CATALOG } from './gift-types.const';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const GIFT_COOLDOWN_MS = 5_000; // 5‑second spam guard

@Injectable()
export class InteractionService {
  constructor(private readonly firebase: FirebaseService) {}

  /* ───────────── Likes ───────────── */
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

  /* ───────────── Comments ───────────── */
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

  /* ───────────── Gifts (w/ 5‑second cooldown) ───────────── */
  async sendGift(
    postId: string,
    senderUid: string,
    giftType: string,
    amount: number,
  ): Promise<string> {
    if (!postId.trim()) throw new BadRequestException('postId cannot be empty');
    if (!senderUid) throw new BadRequestException('Missing senderUid');
    if (!(giftType in GIFT_CATALOG))
      throw new BadRequestException('Unknown gift type');
    if (amount < 1) throw new BadRequestException('Amount must be at least 1');

    // fetch post owner
    const post = await this.firebase.getDocument<{ uid: string }>(
      'posts',
      postId,
    );
    if (!post?.uid) throw new BadRequestException('Post not found');

    /* ---- cooldown check ---- */
    const latestGiftSnap = await this.firebase.db
      .collection(`posts/${postId}/gifts`)
      .where('senderUid', '==', senderUid)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (!latestGiftSnap.empty) {
      const last = latestGiftSnap.docs[0].data() as { createdAt: Timestamp };
      if (Date.now() - last.createdAt.toMillis() < GIFT_COOLDOWN_MS) {
        throw new BadRequestException(
          `Slow down! You can send another gift in ${Math.ceil(
            (GIFT_COOLDOWN_MS - (Date.now() - last.createdAt.toMillis())) /
              1000,
          )} s.`,
        );
      }
    }
    /* ------------------------ */

    const value = GIFT_CATALOG[giftType] * amount;

    const giftId = await this.firebase.addDocument(`posts/${postId}/gifts`, {
      senderUid,
      receiverUid: post.uid,
      giftType,
      amount,
      value,
      createdAt: Timestamp.now(),
    });

    // increment receiver’s balance
    await this.firebase.db
      .collection('users')
      .doc(post.uid)
      .set({ coins: FieldValue.increment(value) }, { merge: true });

    return giftId;
  }

  /* ───────────── Gift Leaderboard ───────────── */
  async getGiftLeaderboard(postId: string, limit = 10) {
    const snap = await this.firebase.db
      .collection(`posts/${postId}/gifts`)
      .orderBy('value', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /* ───────────── User Earnings ───────────── */
  async getUserEarnings(uid: string) {
    if (!uid) throw new BadRequestException('Missing user ID');
    const user = await this.firebase.getDocument<{ coins?: number }>(
      'users',
      uid,
    );
    return { coins: user?.coins ?? 0 };
  }
}
