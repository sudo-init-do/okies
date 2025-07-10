import { Module } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { LiveStreamController } from './live-stream.controller';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [LiveStreamController],
  providers: [LiveStreamService, FirebaseService],
})
export class LiveModule {}
