// src/app.module.ts
import { Module } from '@nestjs/common';

import { FirebaseModule } from './firestore/firebase.module';
import { AuthModule } from './auth/auth.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { InteractionModule } from './interaction/interaction.module';
import { MediaModule } from './media/media.module';
import { EarningsModule } from './earnings/earnings.module';
import { PlunkModule } from './plunk/plunk.module';
import { FollowModule } from './follow/follow.module';
import { ReportModule } from './report/report.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AdminModule } from './admin/admin.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentsModule } from './payments/payments.module';
import { LiveModule } from './live/live.module'; // <-- your new live-stream & chat module

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
    FollowModule,
    ReportModule,
    AnalyticsModule,
    AdminModule,
    WalletModule,
    PaymentsModule,
    LiveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
