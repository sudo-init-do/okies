import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class AuthService {
  async requestOtp(dto: RequestOtpDto): Promise<{ message: string }> {
    const { phoneNumber } = dto;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    );

    await admin.firestore().collection('otps').add({
      phoneNumber,
      otp,
      verified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt,
    });

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{
    message: string;
    uid: string;
    firebaseToken: string;
    jwtToken: string;
  }> {
    const otpSnapshot = await admin
      .firestore()
      .collection('otps')
      .where('phoneNumber', '==', dto.phoneNumber)
      .where('otp', '==', dto.otp)
      .where('verified', '==', false)
      .limit(1)
      .get();

    if (otpSnapshot.empty) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const otpDoc = otpSnapshot.docs[0];
    const otpData = otpDoc.data() as {
      phoneNumber: string;
      otp: string;
      verified: boolean;
      createdAt: FirebaseFirestore.Timestamp;
      expiresAt: FirebaseFirestore.Timestamp;
    };

    const now = new Date();
    const expiresAt = otpData.expiresAt.toDate();

    if (now > expiresAt) {
      throw new UnauthorizedException('OTP has expired');
    }

    await otpDoc.ref.update({ verified: true });

    let user: UserRecord;
    try {
      user = await admin.auth().getUserByPhoneNumber(dto.phoneNumber);
    } catch {
      user = await admin.auth().createUser({ phoneNumber: dto.phoneNumber });
    }

    const firebaseToken = await admin.auth().createCustomToken(user.uid);

    // You can replace this mock token with JWT if you implement JWT strategy
    const jwtToken = `mock-jwt-token-for-${user.uid}`;

    return {
      message: 'OTP verified successfully',
      uid: user.uid,
      firebaseToken,
      jwtToken,
    };
  }
}
