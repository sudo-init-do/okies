// src/wallet/wallet.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  /* ─────────────────────── Balance ─────────────────────── */
  @Get('me')
  getMyBalance(@Req() req) {
    return this.wallet.getBalance(req.user.uid);
  }

  /* ───── Admin: check any user’s balance ───── */
  @Get('balance')
  @UseGuards(AuthGuard, AdminGuard)
  getUserBalance(@Query('uid') uid?: string) {
    if (!uid) throw new BadRequestException('uid query param is required');
    return this.wallet.getBalance(uid);
  }

  /* ───────────────────── Withdrawal ───────────────────── */
  @Post('withdraw')
  requestWithdraw(@Req() req, @Body() dto: WithdrawDto) {
    return this.wallet.requestWithdrawal(req.user.uid, dto);
  }

  /* ───────────────────── Tx History ───────────────────── */
  @Get('transactions')
  getMyTransactions(
    @Req() req,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.wallet.getTransactions(req.user.uid, limit, cursor);
  }

  /* ───────────────────── Manual TOP-UP ───────────────────── */
  @Post('topup')
  topupWallet(@Body() body: { uid: string; nairaAmount: number }) {
    return this.wallet.topupWallet(body.uid, body.nairaAmount);
  }
}
