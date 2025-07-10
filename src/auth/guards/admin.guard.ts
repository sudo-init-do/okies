// src/auth/guards/admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = (req as any).user;        // set in AuthGuard

    if (user?.role === 'admin') return true;
    throw new ForbiddenException('Admins only');
  }
}
