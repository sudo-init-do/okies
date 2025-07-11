// src/live/live.module.ts
import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [LiveController],
  providers: [LiveService, FirebaseService],
})
export class LiveModule {}
