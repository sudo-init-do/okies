// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firestore/firebase.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [AdminController],
})
export class AdminModule {}
