import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { InteractionModule } from './interaction/interaction.module';
import { EarningsModule } from './earnings/earnings.module';
import { FirebaseModule } from './firestore/firebase.module';
import { WalletModule } from './wallet/wallet.module';
import { PlunkModule } from './plunk/plunk.module';
import { MediaModule } from './media/media.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { PaymentsModule } from './payments/payments.module';   // ← NEW

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    FirebaseModule,
    AuthModule,
    CloudflareModule,
    UserModule,
    PostModule,
    InteractionModule,
    MediaModule,
    EarningsModule,
    PlunkModule,
    AdminModule,
    WalletModule,
    PaymentsModule,                                           // ← NEW
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
