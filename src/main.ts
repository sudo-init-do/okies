import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* ───────────── Middleware ───────────── */
  // Paystack requires raw body for HMAC verification
  app.use(
    '/webhook/paystack',
    express.raw({ type: 'application/json' }),
  );
  // Fallback JSON parser for the rest of the API
  app.use(express.json());

  /* ───────────── Global Pipes ───────────── */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  /* ───────────── Start Server ───────────── */
  // Read PORT from env (Render, Heroku, etc.) or default to 3000
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  console.log(`🚀 Application listening on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
