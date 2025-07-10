import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';

@Injectable()
export class ReportService {
  constructor(private readonly firebase: FirebaseService) {}

  async submitReport(uid: string, body: { type: string; targetId: string; reason?: string }) {
    const { type, targetId, reason } = body;

    if (!['user', 'post'].includes(type)) {
      throw new BadRequestException('Invalid report type');
    }

    const ref = this.firebase.db.collection('reports').doc();
    await ref.set({
      reporter: uid,
      type,
      targetId,
      reason: reason ?? '',
      timestamp: Date.now(),
    });

    return { reported: targetId, type };
  }

  async listReports() {
    const snap = await this.firebase.db.collection('reports').orderBy('timestamp', 'desc').limit(100).get();
    return {
      reports: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })),
    };
  }
}
