import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodedIdToken } from 'firebase-admin/auth';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

interface CustomDecodedToken extends DecodedIdToken {
  role?: 'admin' | 'user';
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1) Skip guard if route or controller is marked @Public
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    // 2) Validate bearer token
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException('JWT secret not set');

    try {
      const decoded = jwt.verify(token, secret) as CustomDecodedToken;
      (request as any).user = decoded; // attach
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
