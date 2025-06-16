import { Module } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';

@Module({
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
