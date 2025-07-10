import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly firebase: FirebaseService) {}

  async logEvent(body: { event: string; uid?: string; meta?: any }) {
    if (!body.event) throw new BadRequestException('event is required');

    await this.firebase.db.collection('analytics').add({
      event: body.event,
      uid: body.uid ?? null,
      meta: body.meta ?? {},
      ts: Date.now(),
    });

    return { logged: true };
  }
}
