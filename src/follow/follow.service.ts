import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';

@Injectable()
export class FollowService {
  constructor(private readonly firebase: FirebaseService) {}

  async follow(myUid: string, targetUid: string) {
    if (myUid === targetUid) return { ok: true }; // ignore self-follow
    const batch = this.firebase.db.batch();
    batch.set(
      this.firebase.db.collection('users').doc(targetUid)
        .collection('followers').doc(myUid),
      { ts: Date.now() },
    );
    batch.set(
      this.firebase.db.collection('users').doc(myUid)
        .collection('following').doc(targetUid),
      { ts: Date.now() },
    );
    await batch.commit();
    return { followed: targetUid };
  }

  async unfollow(myUid: string, targetUid: string) {
    const batch = this.firebase.db.batch();
    batch.delete(
      this.firebase.db.collection('users').doc(targetUid)
        .collection('followers').doc(myUid),
    );
    batch.delete(
      this.firebase.db.collection('users').doc(myUid)
        .collection('following').doc(targetUid),
    );
    await batch.commit();
    return { unfollowed: targetUid };
  }

  async listFollowers(uid: string) {
    const snap = await this.firebase.db
      .collection('users').doc(uid)
      .collection('followers').get();
    return { followers: snap.docs.map(d => d.id) };
  }

  async listFollowing(uid: string) {
    const snap = await this.firebase.db
      .collection('users').doc(uid)
      .collection('following').get();
    return { following: snap.docs.map(d => d.id) };
  }

  async suggested(uid: string) {
    const followingSnap = await this.firebase.db
      .collection('users').doc(uid)
      .collection('following').get();
    const already = new Set(followingSnap.docs.map(d => d.id).concat(uid));

    const randomSnap = await this.firebase.db
      .collection('users').orderBy('createdAt').limit(50).get();

    const suggestions = randomSnap.docs
      .filter(d => !already.has(d.id))
      .slice(0, 10)
      .map(d => ({ id: d.id, ...(d.data() as any) }));

    return { suggestions };
  }
}
