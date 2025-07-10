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
  Param,
  BadRequestException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMyBalance(@Req() req) {
    return this.wallet.getBalance(req.user.uid);
  }

  @Get('balance')
  @UseGuards(AuthGuard, AdminGuard)
  getUserBalance(@Query('uid') uid?: string) {
    if (!uid) throw new BadRequestException('uid query param is required');
    return this.wallet.getBalance(uid);
  }

  @Post('withdraw')
  @UseGuards(AuthGuard)
  requestWithdraw(@Req() req, @Body() dto: WithdrawDto) {
    return this.wallet.requestWithdrawal(req.user.uid, dto);
  }

  @Get('transactions')
  @UseGuards(AuthGuard)
  getMyTransactions(
    @Req() req,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.wallet.getTransactions(req.user.uid, limit, cursor);
  }

  @Get('transactions/:uid')
  @UseGuards(AuthGuard, AdminGuard)
  getUserTransactions(
    @Param('uid') uid: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.wallet.getTransactions(uid, limit, cursor);
  }

  @Post('topup')
  @UseGuards(AuthGuard, AdminGuard)
  topupWallet(@Body() body: { uid: string; nairaAmount: number }) {
    return this.wallet.topupWallet(body.uid, body.nairaAmount);
  }
}
