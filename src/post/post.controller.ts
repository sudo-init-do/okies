import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { DecodedIdToken } from 'firebase-admin/auth';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /** Create a post (for real users & bots) */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req() req: { user: DecodedIdToken },
    @Body() body: Omit<CreatePostDto, 'uid'>,
  ) {
    const dto: CreatePostDto = { uid: req.user.uid, ...body };
    const postId = await this.postService.createPost(dto);
    return { message: 'Post created', postId };
  }

  /** Public feed with pagination */
  @Get('feed')
  async feed(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ): Promise<{
    posts: Array<{ id: string } & Record<string, any>>;
    nextCursor: string | null;
  }> {
    const rawPosts = await this.postService.getFeed(limit, cursor);

    type RawPost = {
      id?: string;
      _id?: string;
      uid?: string;
      [key: string]: any;
    };

    const posts: Array<{ id: string } & Record<string, any>> = (
      rawPosts as RawPost[]
    ).map((post) => ({
      id: post.id ?? post._id ?? post.uid ?? '',
      ...post,
    }));

    const nextCursor: string | null = posts.length
      ? posts[posts.length - 1].id
      : null;

    return { posts, nextCursor };
  }
}
