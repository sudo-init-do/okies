import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from '../firestore/firebase.module'; // ✅ Import FirebaseModule so we can use FirebaseService

@Module({
  imports: [
    // Registers the JWT module with secret and expiry settings
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),

    // ✅ Import FirebaseModule to gain access to FirebaseService
    FirebaseModule,
  ],

  // Registers the controller that handles incoming auth routes (e.g. /auth/login)
  controllers: [AuthController],

  // Registers AuthService so it can be injected anywhere in this module
  providers: [AuthService],
})
export class AuthModule {}
