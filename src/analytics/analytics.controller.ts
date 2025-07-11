// src/analytics/analytics.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  /**
   * No auth → even guests can log events
   */
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  log(
    @Body(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    dto: CreateEventDto,
  ) {
    return this.analytics.logEvent(dto);
  }
}
