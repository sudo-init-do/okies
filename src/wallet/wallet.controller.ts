// src/wallet/wallet.controller.ts
import { Controller, Post, Get, Query, Req, Body, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  @Get('me')
  getMyBalance(@Req() req) {
    return this.wallet.getBalance(req.user.uid);
  }

  @Post('withdraw')
  requestWithdraw(@Req() req, @Body() dto: WithdrawDto) {
    return this.wallet.requestWithdrawal(req.user.uid, dto);
  }

  @Get('transactions')
  getMyTransactions(
    @Req() req,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.wallet.getTransactions(req.user.uid, limit, cursor);
  }
}
