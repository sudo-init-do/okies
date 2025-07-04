import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WithdrawalsController } from './withdrawals/withdrawals.controller';
import { PostModule } from './post/post.module';
import { InteractionModule } from './interaction/interaction.module';
import { EarningsModule } from './earnings/earnings.module';
import { FirebaseModule } from './firestore/firebase.module';
import { PlunkModule } from './plunk/plunk.module';
import { MediaModule } from './media/media.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { AdminController } from './admin/admin.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';

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
  ],
  controllers: [AppController, AdminController, WithdrawalsController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
