// src/analytics/dto/create-event.dto.ts
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateEventDto {
  @IsString()
  event: string;

  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
