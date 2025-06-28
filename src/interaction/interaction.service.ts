import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { GIFT_CATALOG } from './gift-types.const';

@Injectable()
export class InteractionService {
  constructor(private readonly firebaseService: FirebaseService) {}

  /* ───────────── Likes ───────────── */
  async likePost(postId: string, uid: string): Promise<void> {
    if (!postId || !uid) throw new BadRequestException('Missing postId or uid');

    await this.firebaseService.setSubDocument('posts', postId, 'likes', uid, {
      likedAt: new Date().toISOString(),
    });
  }

  /* ───────────── Comments ───────────── */
  async commentOnPost(
    postId: string,
    uid: string,
    text: string,
    parentId?: string,
  ): Promise<string> {
    if (!text || !uid || !postId) throw new BadRequestException('Missing data');

    return this.firebaseService.addDocument(`posts/${postId}/comments`, {
      uid,
      text,
      parentId: parentId ?? null,
      createdAt: new Date().toISOString(),
    });
  }

  async getCommentsForPost(
    postId: string,
    limit: number,
    cursorId?: string,
    parentId?: string,
  ) {
    let ref = this.firebaseService.db
      .collection(`posts/${postId}/comments`)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (parentId) ref = ref.where('parentId', '==', parentId);

    if (cursorId) {
      const cursorSnap = await this.firebaseService.db
        .collection(`posts/${postId}/comments`)
        .doc(cursorId)
        .get();

      if (cursorSnap.exists) ref = ref.startAfter(cursorSnap);
    }

    const snap = await ref.get();
    const comments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const nextCursor = comments.length ? comments.at(-1)!.id : null;
    return { comments, nextCursor };
  }

  /* ───────────── Gifts ───────────── */
  async sendGift(
    postId: string,
    senderUid: string,
    giftType: string,
    amount: number,
  ): Promise<string> {
    if (!postId.trim()) {
      throw new BadRequestException('postId cannot be empty');
    }

    if (!senderUid) {
      throw new BadRequestException('Missing senderUid');
    }

    if (!(giftType in GIFT_CATALOG)) {
      throw new BadRequestException('Unknown gift type');
    }

    if (amount < 1) {
      throw new BadRequestException('Amount must be at least 1');
    }

    // Get the post to determine the receiver
    const post = await this.firebaseService.getDocument<{ uid?: string }>(
      'posts',
      postId,
    );
    if (!post || !post.uid) {
      throw new BadRequestException('Post not found or missing owner UID');
    }

    const receiverUid = post.uid;
    const value = GIFT_CATALOG[giftType] * amount;

    // Record the gift
    const giftId = await this.firebaseService.addDocument(
      `posts/${postId}/gifts`,
      {
        senderUid,
        receiverUid,
        giftType,
        amount,
        value,
        createdAt: new Date().toISOString(),
      },
    );

    // Check if the receiver already exists
    const user = await this.firebaseService.getDocument<{ coins?: number }>(
      'users',
      receiverUid,
    );
    const currentCoins = user?.coins ?? 0;

    // Use setDocument to prevent Firestore path error if the document doesn't exist
    await this.firebaseService.setDocument('users', receiverUid, {
      coins: currentCoins + value,
    });

    return giftId;
  }

  /* ───────────── Gift Leaderboard ───────────── */
  async getGiftLeaderboard(postId: string, limit = 10) {
    const snap = await this.firebaseService.db
      .collection(`posts/${postId}/gifts`)
      .orderBy('value', 'desc')
      .limit(limit)
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /* ───────────── User Earnings ───────────── */
  async getUserEarnings(uid: string) {
    if (!uid) throw new BadRequestException('Missing user ID');

    const user = await this.firebaseService.getDocument<{ coins?: number }>(
      'users',
      uid,
    );
    return { coins: user?.coins ?? 0 };
  }
}
