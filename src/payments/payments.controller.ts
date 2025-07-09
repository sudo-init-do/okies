// src/payments/payments.controller.ts
import { Controller, Post, Body, Headers, HttpCode, BadRequestException, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

@Controller('payments/flutter')
export class PaymentsController {        // ← rename this line
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
  simulateTopUp(
    @Body() body: { uid: string; coinAmount: number; amount?: number },
    @Headers('x-dev-key') devKey: string,
  ) {
    if (devKey !== process.env.DEV_ADMIN_KEY) {
      throw new BadRequestException('Unauthorized');
    }
    return this.payments.handleMockTopup(
      body.uid,
      body.coinAmount,
      body.amount ?? body.coinAmount,
    );
  }
}
