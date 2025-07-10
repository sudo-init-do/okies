// src/wallet/dto/request-withdrawal.dto.ts
import { IsNumber, IsString, Min, MaxLength } from 'class-validator';

export class RequestWithdrawalDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @MaxLength(100)
  destination: string;
}
