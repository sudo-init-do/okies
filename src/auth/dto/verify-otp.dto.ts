// src/auth/dto/verify-otp.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Matches(/^\d+$/, { message: 'OTP must contain only numbers' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}
