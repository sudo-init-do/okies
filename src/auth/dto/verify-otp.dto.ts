import { IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  otp: string;
}
