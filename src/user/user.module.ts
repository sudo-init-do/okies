import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseModule } from 'src/firestore/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
