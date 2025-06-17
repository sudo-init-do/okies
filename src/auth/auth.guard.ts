import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or Invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.decode(token) as DecodedIdToken;

      if (!decoded || !decoded.uid || !decoded.phone_number) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
