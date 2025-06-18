import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
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

  // Step 1: Request OTP — generate, store in Firestore, and send via email
  async requestOtp(dto: RequestOtpDto) {
    const { email } = dto;

    // generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // store OTP in Firestore under otp_verification/{email}
    await this.firebaseService.setDocument('otp_verification', email, {
      otp,
      createdAt: new Date().toISOString(),
    });

    // send OTP via email using Plunk
    await this.plunkService.sendOtpEmail(email, otp);

    return {
      message: `OTP sent to ${email}`,
    };
  }

  // Step 2: Verify OTP and create user if not exists
  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    const record = await this.firebaseService.getDocument(
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
      userRecord = await getAuth().createUser({ email });
    }

    const uid: string = userRecord.uid;
    const safeEmail: string = userRecord.email || '';

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

  // Step 3: Fetch user profile using UID from auth token
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
