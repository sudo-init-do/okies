export interface DecodedToken {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
