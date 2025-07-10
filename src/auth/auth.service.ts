import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import {
  getAuth,
  UserRecord,
  DecodedIdToken,
} from 'firebase-admin/auth';
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

  /* ──────────────── OTP AUTH ──────────────── */
  async requestOtp(dto: { email: string }) {
    const email = dto.email.toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.firebase.setDocument('otp_verification', email, {
      otp,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    await this.plunk.sendOtpEmail(email, otp);
    return { message: `OTP sent to ${email}` };
  }

  async verifyOtp(dto: { email: string; otp: string }) {
    const email = dto.email.toLowerCase();
    const record = await this.firebase.getDocument<{ otp: string; expiresAt: string }>(
      'otp_verification',
      email,
    );

    if (!record || record.otp !== dto.otp)
      throw new UnauthorizedException('Invalid or expired OTP');

    if (new Date() > new Date(record.expiresAt))
      throw new UnauthorizedException('OTP has expired');

    let fbUser: UserRecord;
    try {
      fbUser = await getAuth().getUserByEmail(email);
    } catch {
      fbUser = await getAuth().createUser({ email });
    }

    const uid = fbUser.uid;
    const profile =
      (await this.firebase.getDocument<UserProfile>('users', uid)) ??
      (await this._createInitialProfile(uid, email));

    const token = this._signJwt(uid, profile.email, profile.role ?? 'user');

    await this.firebase.setDocument('otp_verification', email, {});
    return {
      message: `Email ${email} verified successfully`,
      token,
      user: { uid, email: profile.email, role: profile.role },
    };
  }

  /* ──────────────── EMAIL SIGNUP ──────────────── */
  async signupWithEmail(email: string, password: string) {
    email = email.toLowerCase();

    try {
      await getAuth().getUserByEmail(email);
      throw new BadRequestException('Email already in use');
    } catch (err: any) {
      if (!err.message?.includes('no user record')) throw err;
    }

    const fbUser = await getAuth().createUser({
      email,
      password,
      emailVerified: false,
    });

    const verifyLink = await getAuth().generateEmailVerificationLink(email);
    await this.plunk.sendOtpEmail(
      email,
      `Welcome to Okies! Please verify your email: <a href="${verifyLink}">${verifyLink}</a>`,
    );

    const profile = await this._createInitialProfile(fbUser.uid, email);

    return {
      message: 'Signup successful. Please check your email to verify.',
      user: {
        uid: fbUser.uid,
        email: profile.email,
      },
    };
  }

  /* ──────────────── EMAIL LOGIN ──────────────── */
  async loginWithEmail(email: string, password: string) {
    email = email.toLowerCase();

    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!apiKey) throw new InternalServerErrorException('FIREBASE_WEB_API_KEY not set');

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    const data = await res.json();
    if (!res.ok) {
      throw new UnauthorizedException(data?.error?.message || 'Login failed');
    }

    if (!data.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const uid = data.localId;
    const profile =
      (await this.firebase.getDocument<UserProfile>('users', uid)) ??
      (await this._createInitialProfile(uid, email));

    const token = this._signJwt(uid, profile.email, profile.role ?? 'user');

    return {
      message: 'Login successful',
      token,
      user: { uid, email: profile.email, role: profile.role },
    };
  }

  /* ──────────────── GOOGLE LOGIN ──────────────── */
  async googleLogin(idToken: string) {
    let decoded: DecodedIdToken;
    try {
      decoded = await getAuth().verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const { uid, email } = decoded;
    if (!email) {
      throw new BadRequestException('Google account has no email');
    }

    const profile =
      (await this.firebase.getDocument<UserProfile>('users', uid)) ??
      (await this._createInitialProfile(uid, email.toLowerCase()));

    const token = this._signJwt(uid, profile.email, profile.role ?? 'user');

    return {
      message: 'Google login successful',
      token,
      user: { uid, email: profile.email, role: profile.role },
    };
  }

  /* ──────────────── PASSWORD RESET ──────────────── */
  async sendPasswordReset(email: string) {
    email = email.toLowerCase();

    try {
      await getAuth().getUserByEmail(email);
    } catch {
      throw new NotFoundException('No account found for that email');
    }

    const link = await getAuth().generatePasswordResetLink(email);
    await this.plunk.sendOtpEmail(
      email,
      `Reset your Okies password: <a href="${link}">${link}</a>`,
    );

    return { message: 'Password reset email sent' };
  }

  /* ──────────────── USER PROFILE UPDATE ──────────────── */
  async updateProfile(uid: string, updates: Partial<{ displayName: string; avatar: string; bio: string }>) {
    const allowed = ['displayName', 'avatar', 'bio'];
    const filtered: Record<string, string> = {};

    for (const key of allowed) {
      if (updates[key]) filtered[key] = updates[key]!;
    }

    if (Object.keys(filtered).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    await this.firebase.updateDocument('users', uid, filtered);
    return { message: 'Profile updated successfully' };
  }

  /* ──────────────── GET CURRENT USER ──────────────── */
  async getProfile(user: DecodedIdToken | undefined) {
    if (!user) throw new UnauthorizedException('User not authenticated');

    const profile = await this.firebase.getDocument<UserProfile>('users', user.uid);
    if (!profile) throw new NotFoundException('User profile not found');

    return profile;
  }

  /* ──────────────── HELPERS ──────────────── */
  private async _createInitialProfile(uid: string, email: string): Promise<UserProfile> {
    const profile: UserProfile = {
      uid,
      email,
      phoneNumber: '',
      displayName: '',
      avatar: '',
      bio: '',
      coins: 0,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    await this.firebase.setDocument<UserProfile>('users', uid, profile);
    return profile;
  }

  private _signJwt(uid: string, email: string, role: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new InternalServerErrorException('JWT_SECRET not set');

    return jwt.sign({ uid, email, role }, secret, { expiresIn: '7d' });
  }
}
