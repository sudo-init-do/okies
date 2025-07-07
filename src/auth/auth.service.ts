// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { getAuth, UserRecord, DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from 'src/firestore/firebase.service';
import { PlunkService } from 'src/plunk/plunk.service';
import { UserProfile } from 'src/firestore/types/user-profile.type';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly plunk: PlunkService,
  ) {}

  /* ─────────────────────────── 1. Request OTP ─────────────────────────── */
  async requestOtp(dto: RequestOtpDto) {
    const email = dto.email.toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await this.firebase.setDocument('otp_verification', email, {
      otp,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    await this.plunk.sendOtpEmail(email, otp);
    return { message: `OTP sent to ${email}` };
  }

  /* ─────────────────────────── 2. Verify OTP ─────────────────────────── */
  async verifyOtp(dto: VerifyOtpDto) {
    const email = dto.email.toLowerCase();

    /* ①  Check OTP record */
    const record = await this.firebase.getDocument<{ otp: string; expiresAt: string }>(
      'otp_verification',
      email,
    );
    if (!record || record.otp !== dto.otp)
      throw new UnauthorizedException('Invalid or expired OTP');
    if (new Date() > new Date(record.expiresAt))
      throw new UnauthorizedException('OTP has expired');

    /* ②  Ensure user exists in Firebase Auth */
    let fbUser: UserRecord;
    try {
      fbUser = await getAuth().getUserByEmail(email);
    } catch {
      fbUser = await getAuth().createUser({ email });
    }

    /* ③  Ensure user profile exists in Firestore */
    const uid = fbUser.uid;
    const profile =
      (await this.firebase.getDocument<UserProfile>('users', uid)) ??
      (await this._createInitialProfile(uid, email));

    /* ④  Sign JWT with role */
    const payload = {
      uid,
      email: profile.email,
      role: profile.role ?? 'user',
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new InternalServerErrorException('JWT_SECRET not set');

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    /* ⑤  Clean-up OTP */
    await this.firebase.setDocument('otp_verification', email, {});

    return {
      message: `Email ${email} verified successfully`,
      token,
      user: payload, //  ⬅️  client now immediately knows their role
    };
  }

  /* ─────────────────────────── 3. Get Profile ─────────────────────────── */
  async getProfile(user: DecodedIdToken | undefined) {
    if (!user) throw new UnauthorizedException('User not authenticated');

    const profile = await this.firebase.getDocument<UserProfile>('users', user.uid);
    if (!profile) throw new NotFoundException('User profile not found');

    return profile;
  }

  /* ─────────────────────────── Helpers ─────────────────────────── */
  private async _createInitialProfile(uid: string, email: string): Promise<UserProfile> {
    const profile: UserProfile = {
      uid,
      email,
      phoneNumber: '',
      displayName: '',
      avatar: '',
      bio: '',
      coins: 0,
      role: 'user',               // 👈 default role
      createdAt: new Date().toISOString(),
    };
    await this.firebase.setDocument<UserProfile>('users', uid, profile);
    return profile;
  }
}
