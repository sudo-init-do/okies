export interface CustomDecodedToken {
  uid: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface AuthenticatedRequest extends Request {
  user?: CustomDecodedToken;
}
