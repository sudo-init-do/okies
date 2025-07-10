// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, FirebaseService],
})
export class AdminModule {}
