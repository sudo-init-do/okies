import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, FirebaseService],
})
export class FollowModule {}
