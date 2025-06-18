// src/plunk/plunk.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlunkService } from './plunk.service';

@Module({
  imports: [HttpModule],
  providers: [PlunkService],
  exports: [PlunkService],
})
export class PlunkModule {}
