// src/firestore/types/user-profile.type.ts
export interface UserProfile {
  uid: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  avatar: string;
  bio: string;
  createdAt: string;
  updatedAt?: string;

  /** 👇 Add these two fields */
  role?: 'admin' | 'user';
  coins?: number;
}
