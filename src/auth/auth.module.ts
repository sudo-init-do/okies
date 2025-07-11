// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthGuard } from './auth.guard';              // <-- our simplified guard
import { FirebaseModule } from '../firestore/firebase.module';
import { PlunkModule } from 'src/plunk/plunk.module';

@Module({
  imports: [
    PassportModule, // for Passport integration (used by JwtStrategy under the hood)
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    FirebaseModule,
    PlunkModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,       // <-- apply our guard app-wide
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
