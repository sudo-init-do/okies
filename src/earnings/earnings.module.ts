import { Module } from '@nestjs/common';
import { EarningsController } from './earnings.controller';
import { EarningsService } from './earnings.service';

@Module({
  controllers: [EarningsController],
  providers: [EarningsService],
})
export class EarningsModule {}
