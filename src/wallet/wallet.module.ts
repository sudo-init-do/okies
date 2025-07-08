// src/wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, FirebaseService],
})
export class WalletModule {}
