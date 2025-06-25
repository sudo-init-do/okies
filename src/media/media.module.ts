// src/media/media.module.ts

import { Module } from '@nestjs/common';
import { CloudflareController } from 'src/cloudflare/cloudflare.controller';
import { CloudflareR2Service } from 'src/cloudflare/cloudflare-r2.service';
import { FirebaseModule } from 'src/firestore/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [CloudflareController],
  providers: [CloudflareR2Service],
})
export class MediaModule {}
