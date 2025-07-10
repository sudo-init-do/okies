import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import fetch from 'node-fetch';

export type ChatMessage = {
  id?: string;
  uid: string;
  message: string;
  timestamp: number;
};

export type GiftEvent = {
  id?: string;
  fromUid: string;
  giftName: string;
  coinCost: number;
  timestamp: number;
};

@Injectable()
export class LiveStreamService {
  private readonly apiKey = process.env.LIVEPEER_API_KEY;
  private readonly apiUrl = 'https://livepeer.studio/api/stream';

  constructor(private readonly firebase: FirebaseService) {
    if (!this.apiKey) {
      throw new Error('LIVEPEER_API_KEY not set in environment variables.');
    }
  }

  /** Create and persist a new Livepeer stream */
  async createStream(title: string) {
    const payload = {
      name: title || `Okies Live ${Date.now()}`,
      profiles: [
        { name: '720p', bitrate: 2000000, fps: 30, width: 1280, height: 720 },
        { name: '480p', bitrate: 1000000, fps: 30, width: 854, height: 480 },
        { name: '360p', bitrate: 500000, fps: 30, width: 640, height: 360 },
      ],
    };

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = null; }

    if (!res.ok) {
      const errMsg =
        data?.errors?.[0]?.message ||
        data?.message ||
        text ||
        'Unknown Livepeer error';
      throw new InternalServerErrorException(`Livepeer API error: ${errMsg}`);
    }

    const stream = {
      id: data.id,
      title: title || 'Untitled Stream',
      streamKey: data.streamKey,
      playbackId: data.playbackId,
      createdAt: new Date().toISOString(),
      status: 'idle' as const,
    };

    await this.firebase.setDocument('livestreams', data.id, stream);
    return { message: 'Stream created', stream };
  }

  /** Mark a stream as ended in Firestore */
  async endStream(id: string) {
    await this.firebase.updateDocument('livestreams', id, {
      status: 'ended',
      endedAt: new Date().toISOString(),
    });
    return { message: 'Stream ended' };
  }

  /** Fetch all streams where status==='idle' */
  async listActiveStreams() {
    const snap = await this.firebase.db
      .collection('livestreams')
      .where('status', '==', 'idle')
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map(d => d.data());
  }

  /** Fetch a single stream’s metadata + playback URL */
  async getStreamById(id: string) {
    const doc = await this.firebase.db.collection('livestreams').doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException('Stream not found');
    }
    const data = doc.data()!;
    return {
      ...data,
      playbackUrl: `https://cdn.livepeer.com/hls/${data.playbackId}/index.m3u8`,
    };
  }

  /** Post a chat message under livestreams/{streamId}/comments */
  async postChatMessage(
    streamId: string,
    uid: string,
    message: string,
  ): Promise<ChatMessage> {
    const streamRef = this.firebase.db.collection('livestreams').doc(streamId);
    const streamSnap = await streamRef.get();
    if (!streamSnap.exists) {
      throw new NotFoundException('Stream not found');
    }

    const comment: ChatMessage = {
      uid,
      message,
      timestamp: Date.now(),
    };

    const commentRef = await streamRef.collection('comments').add(comment);
    return { id: commentRef.id, ...comment };
  }

  /** Fetch last N chat messages, oldest first */
  async getChatMessages(
    streamId: string,
    limit = 50,
  ): Promise<ChatMessage[]> {
    const streamRef = this.firebase.db.collection('livestreams').doc(streamId);
    const streamSnap = await streamRef.get();
    if (!streamSnap.exists) {
      throw new NotFoundException('Stream not found');
    }

    const snap = await streamRef
      .collection('comments')
      .orderBy('timestamp', 'asc')
      .limit(limit)
      .get();

    return snap.docs.map(d => ({ id: d.id, ...(d.data() as ChatMessage) }));
  }

  /** Send a gift: deduct coins + record event */
  async sendGift(
    streamId: string,
    fromUid: string,
    giftName: string,
    coinCost: number,
  ): Promise<GiftEvent> {
    const streamRef = this.firebase.db.collection('livestreams').doc(streamId);
    const streamSnap = await streamRef.get();
    if (!streamSnap.exists) {
      throw new NotFoundException('Stream not found');
    }

    const userRef = this.firebase.db.collection('users').doc(fromUid);

    let event: GiftEvent;
    await this.firebase.db.runTransaction(async t => {
      const userSnap = await t.get(userRef);
      const currentCoins = userSnap.data()?.coins || 0;
      if (currentCoins < coinCost) {
        throw new BadRequestException('Insufficient coins');
      }

      // Deduct coins
      t.update(userRef, { coins: currentCoins - coinCost });

      // Record gift
      event = {
        fromUid,
        giftName,
        coinCost,
        timestamp: Date.now(),
      };
      const giftRef = streamRef.collection('gifts').doc();
      t.set(giftRef, event);
      event.id = giftRef.id;
    });

    return event!;
  }

  /** Fetch all gifts for a stream, oldest first */
  async listGifts(streamId: string): Promise<GiftEvent[]> {
    const streamRef = this.firebase.db.collection('livestreams').doc(streamId);
    const streamSnap = await streamRef.get();
    if (!streamSnap.exists) {
      throw new NotFoundException('Stream not found');
    }

    const snap = await streamRef
      .collection('gifts')
      .orderBy('timestamp', 'asc')
      .get();

    return snap.docs.map(d => ({ id: d.id, ...(d.data() as GiftEvent) }));
  }
}
