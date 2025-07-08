// src/wallet/dto/withdraw.dto.ts
import { IsNumber, IsString, Min } from 'class-validator';

export class WithdrawDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  destination: string;
}
