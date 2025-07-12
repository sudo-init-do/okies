import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { FieldValue } from 'firebase-admin/firestore';
import {
  RtcTokenBuilder,
  RtcRole,
  RtmTokenBuilder,
  RtmRole,
} from 'agora-access-token';

@Injectable()
export class LiveService {
  private readonly appId: string;
  private readonly appCert: string;

  constructor(private readonly firebase: FirebaseService) {
    this.appId = process.env.AGORA_APP_ID!;
    this.appCert = process.env.AGORA_APP_CERTIFICATE!;
    if (!this.appId || !this.appCert) {
      throw new InternalServerErrorException(
        'AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set',
      );
    }
  }

  /** Generate an Agora RTC token (uid defaults to 0) */
  getRtcToken(channelName: string, uid?: number) {
    const userId = typeof uid === 'number' ? uid : 0;
    const expireSeconds = 3600;
    const now = Math.floor(Date.now() / 1000);
    const privilegeTs = now + expireSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCert,
      channelName,
      userId,
      RtcRole.PUBLISHER,
      privilegeTs,
    );

    return { appId: this.appId, token, uid: userId };
  }

  /** Generate an Agora RTM (chat) token */
  getChatToken(userId: string) {
    const expireSeconds = 3600;
    const now = Math.floor(Date.now() / 1000);
    const privilegeTs = now + expireSeconds;

    const token = RtmTokenBuilder.buildToken(
      this.appId,
      this.appCert,
      userId,
      RtmRole.Rtm_User,
      privilegeTs,
    );

    return { appId: this.appId, token, userId };
  }

  /** Add a chat message under livestreams/{streamId}/chat */
  async addChatMessage(
    streamId: string,
    uid: string,
    message: string,
  ) {
    const col = this.firebase.db
      .collection('livestreams')
      .doc(streamId)
      .collection('chat');
    const ref = col.doc();
    const timestamp = Date.now();
    await ref.set({ uid, message, timestamp });
    return { id: ref.id, uid, message, timestamp };
  }

  /** Fetch all chat messages for a given stream */
  async getChatMessages(streamId: string) {
    const snap = await this.firebase.db
      .collection('livestreams')
      .doc(streamId)
      .collection('chat')
      .orderBy('timestamp', 'asc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  }

  /** Deduct coins & record a gift under livestreams/{streamId}/gifts */
  async sendGift(
    fromUid: string,
    streamId: string,
    coins: number,
  ) {
    if (coins <= 0) {
      throw new BadRequestException('Invalid coin amount');
    }

    const userRef = this.firebase.db.collection('users').doc(fromUid);
    const giftsCol = this.firebase.db
      .collection('livestreams')
      .doc(streamId)
      .collection('gifts');

    await this.firebase.db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      const balance = userSnap.data()?.coins ?? 0;
      if (balance < coins) {
        throw new BadRequestException('Insufficient balance');
      }
      tx.update(userRef, { coins: FieldValue.increment(-coins) });
      const giftRef = giftsCol.doc();
      tx.set(giftRef, { fromUid, coins, timestamp: Date.now() });
    });

    return { message: 'Gift sent', streamId, coins };
  }

  /** Start a 1:1 or group call session */
  async startCall(streamId: string, hostUid: string) {
    const callRef = this.firebase.db.collection('live_calls').doc();
    const callId = callRef.id;
    const rtc = this.getRtcToken(callId, Number(hostUid));
    const rtm = this.getChatToken(hostUid);
    const startedAt = Date.now();

    const session = {
      id: callId,
      streamId,
      hostUid,
      channelName: callId,
      rtcToken: rtc.token,
      rtmToken: rtm.token,
      startedAt,
    };

    await callRef.set(session);
    return session;
  }

  /** End an existing call session */
  async endCall(callId: string) {
    const ref = this.firebase.db.collection('live_calls').doc(callId);
    const snap = await ref.get();
    if (!snap.exists) {
      throw new BadRequestException('Call not found');
    }

    const endedAt = Date.now();
    await ref.update({ endedAt });
    return { message: 'Call ended', callId, endedAt };
  }
}
