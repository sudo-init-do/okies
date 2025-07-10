import { Controller, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  /**
   * No auth → even guests can log events
   * Body: { event: 'open_app' | 'watch_video' | ... , uid?: string , meta?: any }
   */
  @Post()
  log(@Body() body: { event: string; uid?: string; meta?: any }) {
    return this.analytics.logEvent(body);
  }
}
