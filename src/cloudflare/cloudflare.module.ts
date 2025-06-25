import { Module } from '@nestjs/common';
import { CloudflareR2Service } from './cloudflare-r2.service';
import { CloudflareController } from './cloudflare.controller';
import { FirebaseModule } from 'src/firestore/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [CloudflareR2Service],
  controllers: [CloudflareController],
  exports: [CloudflareR2Service],
})
export class CloudflareModule {}
