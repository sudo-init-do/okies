import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  // Register FirebaseService as a provider so it can be injected
  providers: [FirebaseService],

  // Export FirebaseService so it can be used in other modules (e.g., AuthModule, UserModule)
  exports: [FirebaseService],
})
export class FirebaseModule {}
