import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  async requestOtp(dto: RequestOtpDto) {
    await Promise.resolve();

    return {
      message: `OTP sent to ${dto.phoneNumber}`,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    await Promise.resolve();

    return {
      message: `Phone number ${dto.phoneNumber} verified successfully`,
    };
  }

  async getProfile(user: DecodedIdToken | undefined) {
    await Promise.resolve();

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return {
      uid: user.uid,
      phoneNumber: user.phone_number ?? null,
    };
  }
}
