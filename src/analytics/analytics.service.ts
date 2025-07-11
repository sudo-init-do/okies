// src/analytics/analytics.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { CreateEventDto } from './dto/create-event.dto';
import { FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class AnalyticsService {
  constructor(private readonly firebase: FirebaseService) {}

  async logEvent(dto: CreateEventDto): Promise<{ logged: true }> {
    if (!dto.event) {
      throw new BadRequestException('event is required');
    }

    await this.firebase.db
      .collection('analytics')
      .add({
        event: dto.event,
        uid: dto.uid ?? null,
        meta: dto.meta ?? {},
        ts: FieldValue.serverTimestamp(),
      });

    return { logged: true };
  }
}
