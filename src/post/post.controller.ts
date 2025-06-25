// src/post/post.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { DecodedIdToken } from 'firebase-admin/auth';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // (Bots will call this too)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req() req: { user: DecodedIdToken },
    @Body() body: Omit<CreatePostDto, 'uid'>,
  ) {
    const dto: CreatePostDto = { uid: req.user.uid, ...body };
    const id = await this.postService.createPost(dto);
    return { message: 'Post created', postId: id };
  }

  // Public feed
  @Get('feed')
  async feed(@Query('limit') limit = '20', @Query('cursor') cursor?: string) {
    const posts = await this.postService.getFeed(Number(limit), cursor);
    return { posts };
  }
}
