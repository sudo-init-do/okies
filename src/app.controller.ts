// src/app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { AppService }      from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint
   * GET /
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check endpoint
   * GET /health
   */
  @Get('health')
  getHealth(): {
    status: 'ok';
    uptime: number;
    timestamp: string;
  } {
    return {
      status:    'ok',
      uptime:    process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
