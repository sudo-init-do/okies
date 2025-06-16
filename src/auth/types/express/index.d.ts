declare namespace Express {
  interface Request {
    user?: {
      uid: string;
      phone_number: string;
    };
  }
}
