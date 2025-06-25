// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firestore/firebase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './types/post.type';

@Injectable()
export class PostService {
  constructor(private readonly firebase: FirebaseService) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const post: Omit<Post, 'postId'> = {
      uid: dto.uid,
      caption: dto.caption,
      mediaUrl: dto.mediaUrl,
      contentType: dto.contentType,
      createdAt: new Date().toISOString(),
    };

    // let Firestore choose an ID
    return await this.firebase.addDocument('posts', post);
  }

  async getFeed(limit = 20, startAfter?: string): Promise<Post[]> {
    let query = this.firebase['db']
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (startAfter) {
      const doc = await this.firebase.getDocument<Post>('posts', startAfter);
      if (!doc) throw new NotFoundException('Cursor not found');
      query = query.startAfter(doc.createdAt);
    }

    const snap = await query.get();
    return snap.docs.map((d) => {
      const data = d.data() as Omit<Post, 'postId'>;
      return { postId: d.id, ...data };
    });
  }
}
