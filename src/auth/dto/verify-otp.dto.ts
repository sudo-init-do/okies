import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  otp: string;
}
