import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, FirebaseService],
})
export class AnalyticsModule {}
