import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UpdateProfileDto } from 'src/user/update-profile.dto';
import { UserProfile } from 'src/firestore/types/user-profile.type';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

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

  async updateProfile(user: DecodedIdToken | undefined, dto: UpdateProfileDto) {
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

    const updated: UserProfile = {
      ...profile,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    await this.firebaseService.setDocument('users', user.uid, updated);

    return {
      message: 'Profile updated successfully',
      profile: updated,
    };
  }
}
