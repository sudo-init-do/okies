import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, FirebaseService],
})
export class ReportModule {}
