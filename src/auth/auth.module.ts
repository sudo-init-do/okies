import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from '../firestore/firebase.module';
import { PlunkModule } from 'src/plunk/plunk.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule, // Required for AuthGuard('jwt')
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    FirebaseModule,
    PlunkModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Register strategy
  exports: [AuthService, JwtModule], // Export if needed by other modules
})
export class AuthModule {}
