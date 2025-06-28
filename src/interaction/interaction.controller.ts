// src/interaction/interaction.controller.ts
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
import { AuthGuard } from '@nestjs/passport';
import { InteractionService } from './interaction.service';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SendGiftDto } from './dto/send-gift.dto';

@Controller('interact')
@UseGuards(AuthGuard('jwt'))
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  /* ───── Like ───── */
  @Post('like')
  async like(
    @Req() req: { user: DecodedIdToken },
    @Body('postId') postId: string,
  ) {
    await this.interactionService.likePost(postId, req.user.uid);
    return { message: 'Post liked' };
  }

  /* ───── Comment ───── */
  @Post('comment')
  async comment(
    @Req() req: { user: DecodedIdToken },
    @Body() dto: CreateCommentDto,
  ) {
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
  async gift(@Req() req: { user: DecodedIdToken }, @Body() dto: SendGiftDto) {
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
  async earnings(@Req() req: { user: DecodedIdToken }) {
    // uses uid from the verified JWT
    return this.interactionService.getUserEarnings(req.user.uid);
  }
}
