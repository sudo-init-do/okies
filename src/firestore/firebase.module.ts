import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  // Declare the FirebaseService as a provider so Nest can inject it
  providers: [FirebaseService],

  // Export the service so other modules (like AuthModule) can use it
  exports: [FirebaseService],
})
export class FirebaseModule {} // This module wraps and shares the FirebaseService
