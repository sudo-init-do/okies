// src/common/guards/auth.guard.ts
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
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      if (!process.env.JWT_SECRET) {
        throw new UnauthorizedException('JWT secret is not defined');
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as unknown as DecodedIdToken;

      if (!decoded?.uid) {
        throw new UnauthorizedException('Invalid token payload');
      }

      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
