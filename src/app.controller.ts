import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // existing root endpoint
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // new health‐check endpoint
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
