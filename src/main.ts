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
  // use PORT from env (Render, Heroku, Docker, etc.)
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀  Application is running on: http://0.0.0.0:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
