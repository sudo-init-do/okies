import { Module } from '@nestjs/common';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { InteractionModule } from './interaction/interaction.module';
import { EarningsModule } from './earnings/earnings.module';
import { FirebaseModule } from './firestore/firebase.module';
import { PlunkModule } from './plunk/plunk.module';

@Module({
  imports: [
    FirebaseModule,
    AuthModule,
    CloudflareModule,
    UserModule,
    PostModule,
    InteractionModule,
    EarningsModule,
    PlunkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
