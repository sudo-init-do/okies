import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LiveService } from './live.service';

@Controller('live')
@UseGuards(AuthGuard)
export class LiveController {
  constructor(private readonly live: LiveService) {}

  /** Generate an Agora RTC token */
  @Post('token')
  getRtcToken(@Body() body: { channelName?: string; uid?: number }) {
    const { channelName, uid } = body;
    if (!channelName) {
      throw new BadRequestException('channelName is required');
    }
    return this.live.getRtcToken(channelName, uid);
  }

  /** Generate an Agora RTM (chat) token */
  @Post('chat/token')
  getRtmToken(@Body() body: { userId?: string }) {
    const { userId } = body;
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.live.getChatToken(userId);
  }

  /** Post a chat message under a livestream */
  @Post('chat')
  postChat(
    @Req() req,
    @Body() body: { streamId?: string; message?: string },
  ) {
    const { streamId, message } = body;
    if (!streamId || !message) {
      throw new BadRequestException('streamId and message are required');
    }
    return this.live.addChatMessage(streamId, req.user.uid, message);
  }

  /** Read chat history for a given stream */
  @Get('chat/:streamId')
  getChat(@Param('streamId') streamId: string) {
    return this.live.getChatMessages(streamId);
  }

  /** Send a gift (coins) in a livestream */
  @Post('gift')
  sendGift(
    @Req() req,
    @Body() body: { streamId?: string; coins?: number },
  ) {
    const { streamId, coins } = body;
    if (!streamId || typeof coins !== 'number') {
      throw new BadRequestException('streamId and coins are required');
    }
    return this.live.sendGift(req.user.uid, streamId, coins);
  }

  /** Start a 1:1 or group call session */
  @Post('call/start')
  startCall(
    @Req() req,
    @Body() body: { streamId?: string },
  ) {
    const { streamId } = body;
    if (!streamId) {
      throw new BadRequestException('streamId is required');
    }
    return this.live.startCall(streamId, req.user.uid);
  }

  /** End an existing call session */
  @Post('call/end')
  endCall(@Body() body: { callId?: string }) {
    const { callId } = body;
    if (!callId) {
      throw new BadRequestException('callId is required');
    }
    return this.live.endCall(callId);
  }
}
