// src/app.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Simple root greeting
   */
  getHello(): string {
    return 'Hello World!';
  }
}
