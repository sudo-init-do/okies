// src/auth/dto/verify-otp.dto.ts

import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,6}$/, {
    message: 'OTP must be a 4-6 digit code',
  })
  otp: string;
}
