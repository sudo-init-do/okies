import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { DecodedIdToken, getAuth, UserRecord } from 'firebase-admin/auth';
import { FirebaseService } from 'src/firestore/firebase.service';
import { PlunkService } from 'src/plunk/plunk.service';
import { UserProfile } from 'src/firestore/types/user-profile.type';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly plunkService: PlunkService,
  ) {}

  /**
   * Step 1 — Request OTP:
   * Generate a 6-digit OTP, store it under otp_verification/{email}, and send it via Plunk.
   */
  async requestOtp(dto: RequestOtpDto) {
    const email = dto.email.toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await this.firebaseService.setDocument('otp_verification', email, {
        otp,
        createdAt: new Date().toISOString(),
      });

      await this.plunkService.sendOtpEmail(email, otp);

      return { message: `OTP sent to ${email}` };
    } catch (err) {
      console.error('❌ Error in requestOtp:', err);
      throw new InternalServerErrorException(
        'Failed to send OTP. Try again later.',
      );
    }
  }

  /**
   * Step 2 — Verify OTP:
   * Check stored OTP, create Firebase Auth user if not exists, and return a signed JWT.
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const email = dto.email.toLowerCase();
    const otp = dto.otp;

    const record = await this.firebaseService.getDocument<{ otp: string }>(
      'otp_verification',
      email,
    );

    if (!record || record.otp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    let userRecord: UserRecord;

    try {
      userRecord = await getAuth().getUserByEmail(email);
    } catch {
      try {
        userRecord = await getAuth().createUser({ email });
      } catch (err) {
        console.error('❌ Error creating Firebase user:', err);
        throw new InternalServerErrorException(
          'Failed to create user account.',
        );
      }
    }

    const uid = userRecord.uid;
    const safeEmail = userRecord.email || email;

    const existing = await this.firebaseService.getDocument<UserProfile>(
      'users',
      uid,
    );

    if (!existing) {
      await this.firebaseService.setDocument<UserProfile>('users', uid, {
        uid,
        email: safeEmail,
        phoneNumber: userRecord.phoneNumber || '',
        createdAt: new Date().toISOString(),
        displayName: '',
        avatar: '',
        bio: '',
      });
    }

    const token = jwt.sign({ uid, email: safeEmail }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return {
      message: `Email ${safeEmail} verified successfully`,
      token,
    };
  }

  /**
   * Step 3 — Get Authenticated User Profile:
   * Returns profile stored in Firestore under users/{uid}
   */
  async getProfile(user: DecodedIdToken | undefined) {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const profile = await this.firebaseService.getDocument<UserProfile>(
      'users',
      user.uid,
    );

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }
}
