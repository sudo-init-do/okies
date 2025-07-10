import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('email/signup')
  signupWithEmail(@Body() body: { email: string; password: string }) {
    return this.authService.signupWithEmail(body.email, body.password);
  }

  @Post('email/login')
  loginWithEmail(@Body() body: { email: string; password: string }) {
    return this.authService.loginWithEmail(body.email, body.password);
  }

  @Post('email/reset-password')
  resetPassword(@Body() body: { email: string }) {
    return this.authService.sendPasswordReset(body.email);
  }

  @Post('google')
  googleLogin(@Body() body: { idToken: string }) {
    return this.authService.googleLogin(body.idToken);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return this.authService.getProfile((req as any).user);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  updateProfile(@Req() req: Request, @Body() body: Partial<{ displayName: string; bio: string; avatar: string }>) {
    return this.authService.updateProfile((req as any).user.uid, body);
  }
}
