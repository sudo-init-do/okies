// src/payments/payments.controller.ts
import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('payments/flutter')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('init')
  initializePayment(@Body() body: { uid: string; coinAmount: number }) {
    return this.payments.initializeFlutterwavePayment(body.uid, body.coinAmount);
  }

  @Post('webhook')
  @HttpCode(200)
  handleWebhook(
    @Req() req: Request,
    @Headers('verif-hash') signature: string,
  ) {
    return this.payments.handleFlutterwaveWebhook(req.body, signature);
  }

  @Post('mock')
  @UseGuards(AuthGuard, AdminGuard)
  simulateTopUp(@Body() body: { uid: string; coinAmount: number; amount?: number }) {
    return this.payments.handleMockTopup(
      body.uid,
      body.coinAmount,
      body.amount ?? body.coinAmount,
    );
  }
}
