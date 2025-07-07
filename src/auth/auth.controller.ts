// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthGuard } from './auth.guard'; // path correct in your project

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Public: send a 6-digit OTP e-mail */
  @Post('request-otp')
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  /** Public: verify OTP and issue JWT */
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  /** Protected: return current user profile */
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = (req as any).user;          // populated by AuthGuard
    return this.authService.getProfile(user);
  }
}
