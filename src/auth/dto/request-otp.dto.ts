import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RequestOtpDto {
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;
}
