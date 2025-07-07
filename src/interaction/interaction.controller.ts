import {
  Controller,
  UseGuards,
  Post,
  Get,
  Param,
  Body,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { InteractionService } from './interaction.service';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SendGiftDto } from './dto/send-gift.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('interactions')
@UseGuards(AuthGuard)
export class InteractionController {   // ✅ Make sure `export` is here
  constructor(private readonly interactionService: InteractionService) {}

  @Post(':postId/like')
  async likePost(
    @Param('postId') postId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.interactionService.likePost(postId, req.user!.uid);
    return { message: 'Post liked' };
  }

  @Post(':postId/unlike')
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.interactionService.unlikePost(postId, req.user!.uid);
    return { message: 'Post unliked' };
  }

  @Post(':postId/comment')
  async commentOnPost(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const commentId = await this.interactionService.commentOnPost(
      postId,
      req.user!.uid,
      dto.text,
      dto.parentId,
    );
    return { message: 'Comment added', commentId };
  }

  @Post(':postId/gift')
  async giftPost(
    @Param('postId') postId: string,
    @Body() dto: SendGiftDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const giftId = await this.interactionService.sendGift(
      postId,
      req.user!.uid,
      dto.giftType,
      dto.amount,
    );
    return { message: 'Gift sent', giftId };
  }

  @Get(':postId/comments')
  async listComments(
    @Param('postId') postId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.interactionService.getCommentsForPost(
      postId,
      limit,
      cursor,
      parentId,
    );
  }

  @Public()
  @Get(':postId/gift-leaderboard')
  async giftLeaderboard(@Param('postId') postId: string) {
    return {
      leaderboard: await this.interactionService.getGiftLeaderboard(postId),
    };
  }

  @Get('earnings')
  async earnings(@Req() req: AuthenticatedRequest) {
    return this.interactionService.getUserEarnings(req.user!.uid);
  }
}
