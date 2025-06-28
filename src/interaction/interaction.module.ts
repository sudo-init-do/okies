import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { FirebaseModule } from 'src/firestore/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
