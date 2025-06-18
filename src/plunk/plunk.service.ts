// src/plunk/plunk.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PlunkService {
  private readonly apiUrl = 'https://api.useplunk.com/v1/send';
  private readonly apiKey = process.env.PLUNK_API_KEY;

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const payload = {
      to,
      subject: 'Your Okies OTP Code',
      body: `Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.`,
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new InternalServerErrorException(
        `Failed to send email: ${errorText}`,
      );
    }
  }
}
