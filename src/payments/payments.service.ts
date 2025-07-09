// src/payments/payments.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FirebaseService } from 'src/firestore/firebase.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly http: HttpService,
    private readonly firebase: FirebaseService,
  ) {}

  async initializeFlutterwavePayment(uid: string, coinAmount: number) {
    if (!uid || !coinAmount) {
      throw new BadRequestException('uid and coinAmount are required');
    }

    const nairaAmount = coinAmount * 1; // 1 coin = ₦1

    const payload = {
      tx_ref: `okies_${uid}_${Date.now()}`,
      amount: nairaAmount,
      currency: 'NGN',
      redirect_url: 'https://okies.africa/topup-success',
      payment_options: 'card,banktransfer,ussd',
      customer: {
        email: `${uid}@okies.africa`,
        name: uid,
      },
      meta: {
        uid,
        coinAmount,
      },
      customizations: {
        title: 'Okies Coin Top-up',
        logo: 'https://okies.africa/logo.png',
      },
    };

    const res$ = this.http.post('https://api.flutterwave.com/v3/payments', payload, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const response = await firstValueFrom(res$);
    return {
      paymentLink: response.data.data.link,
    };
  }

  async handleFlutterwaveWebhook(body: any, signature: string) {
    const secretHash = process.env.FLW_HASH_SECRET;
    if (!secretHash || !signature) return;

    const generatedHash = crypto
      .createHmac('sha256', secretHash)
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== generatedHash) {
      throw new BadRequestException('Invalid Flutterwave signature');
    }

    if (body.event !== 'charge.completed') return;

    const data = body.data;
    const meta = data?.meta;
    const uid = meta?.uid;
    const coinAmount = meta?.coinAmount;

    if (!uid || !coinAmount) return;

    const userRef = this.firebase.db.collection('users').doc(uid);

    await this.firebase.db.runTransaction(async (t) => {
      const userSnap = await t.get(userRef);
      if (!userSnap.exists) return;

      const currentCoins = userSnap.data()?.coins || 0;
      t.update(userRef, {
        coins: currentCoins + coinAmount,
      });

      const txLogRef = userRef.collection('topups').doc(data.tx_ref);

      t.set(txLogRef, {
        amount: data.amount,
        coinAmount,
        txRef: data.tx_ref,
        gateway: 'flutterwave',
        status: 'success',
        timestamp: Date.now(),
      });
    });
  }

  // 👇 New: Handles local mock top-ups
  async handleMockTopup(uid: string, coinAmount: number, amount: number) {
    const userRef = this.firebase.db.collection('users').doc(uid);
    const txRef = `mock_${Date.now()}`;

    await this.firebase.db.runTransaction(async (t) => {
      const userSnap = await t.get(userRef);
      if (!userSnap.exists) return;

      const currentCoins = userSnap.data()?.coins || 0;

      t.update(userRef, {
        coins: currentCoins + coinAmount,
      });

      const txLogRef = userRef.collection('topups').doc(txRef);

      t.set(txLogRef, {
        amount,
        coinAmount,
        txRef,
        gateway: 'mock',
        status: 'success',
        timestamp: Date.now(),
      });
    });
  }
}
