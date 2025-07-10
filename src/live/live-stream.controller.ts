import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { LiveStreamService, ChatMessage, GiftEvent } from './live-stream.service';

@Controller('live')
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  /** Admin-only: create a new Livepeer stream */
  @UseGuards(AuthGuard, AdminGuard)
  @Post('create')
  async createStream(@Body() body: { title: string }) {
    return this.liveStreamService.createStream(body.title);
  }

  /** Admin-only: end an existing stream */
  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id/end')
  async endStream(@Param('id') id: string) {
    return this.liveStreamService.endStream(id);
  }

  /** Public: list all active (idle) streams */
  @Get('active')
  async listActiveStreams() {
    return this.liveStreamService.listActiveStreams();
  }

  /** Public: fetch a single stream’s metadata & playback URL */
  @Get(':id')
  async getStream(@Param('id') id: string) {
    return this.liveStreamService.getStreamById(id);
  }

  /** Authenticated users post chat messages */
  @UseGuards(AuthGuard)
  @Post(':id/chat')
  async postChat(
    @Param('id') streamId: string,
    @Req() req,
    @Body('message') message: string,
  ): Promise<ChatMessage> {
    return this.liveStreamService.postChatMessage(
      streamId,
      req.user.uid,
      message,
    );
  }

  /** Anyone can fetch recent chat; oldest first */
  @Get(':id/chat')
  async fetchChat(
    @Param('id') streamId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<ChatMessage[]> {
    return this.liveStreamService.getChatMessages(streamId, limit);
  }

  /** Authenticated users send gifts */
  @UseGuards(AuthGuard)
  @Post(':id/gift')
  async sendGift(
    @Param('id') streamId: string,
    @Req() req,
    @Body() body: { giftName: string; coinCost: number },
  ): Promise<GiftEvent> {
    return this.liveStreamService.sendGift(
      streamId,
      req.user.uid,
      body.giftName,
      body.coinCost,
    );
  }

  /** Anyone can fetch gift events; oldest first */
  @Get(':id/gifts')
  async listGifts(@Param('id') streamId: string): Promise<GiftEvent[]> {
    return this.liveStreamService.listGifts(streamId);
  }
}
