import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { InteractionService } from './interaction.service';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SendGiftDto } from './dto/send-gift.dto';

@Controller('interact')
@UseGuards(AuthGuard)
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  /* ───── Like ───── */
  @Post('like')
  async like(@Req() req: AuthenticatedRequest, @Body('postId') postId: string) {
    if (!req.user?.uid) {
      throw new Error('User UID is missing from request');
    }
    await this.interactionService.likePost(postId, req.user.uid);
    return { message: 'Post liked' };
  }

  @Post('unlike')
  async unlike(
    @Req() req: AuthenticatedRequest,
    @Body('postId') postId: string,
  ) {
    if (!req.user?.uid) {
      throw new Error('User UID is missing from request');
    }
    await this.interactionService.unlikePost(postId, req.user.uid);
    return { message: 'Post unliked' };
  }

  /* ───── Comment ───── */
  @Post('comment')
  async comment(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCommentDto,
  ) {
    if (!req.user?.uid) {
      throw new Error('User UID is missing from request');
    }
    const commentId = await this.interactionService.commentOnPost(
      dto.postId,
      req.user.uid,
      dto.text,
      dto.parentId ?? undefined,
    );
    return { message: 'Comment added', commentId };
  }

  /* ───── Gift ───── */
  @Post('gift')
  async gift(@Req() req: AuthenticatedRequest, @Body() dto: SendGiftDto) {
    if (!req.user?.uid) {
      throw new Error('User UID is missing from request');
    }
    const giftId = await this.interactionService.sendGift(
      dto.postId,
      req.user.uid,
      dto.giftType,
      dto.amount,
    );
    return { message: 'Gift sent', giftId };
  }

  /* ───── List Comments (paginated) ───── */
  @Get('comments/:postId')
  async getComments(
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

  /* ───── Gift Leaderboard for a Post ───── */
  @Get('gift-leaderboard/:postId')
  async giftLeaderboard(@Param('postId') postId: string) {
    return {
      leaderboard: await this.interactionService.getGiftLeaderboard(postId),
    };
  }

  /* ───── Current User Earnings ───── */
  @Get('earnings')
  async earnings(@Req() req: AuthenticatedRequest) {
    if (!req.user?.uid) {
      throw new Error('User UID is missing from request');
    }
    return this.interactionService.getUserEarnings(req.user.uid);
  }
}
