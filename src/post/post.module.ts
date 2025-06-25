// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { FirebaseService } from 'src/firestore/firebase.service';

@Module({
  controllers: [PostController],
  providers: [PostService, FirebaseService],
})
export class PostModule {}
