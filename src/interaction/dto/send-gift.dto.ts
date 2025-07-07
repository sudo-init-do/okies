// src/interaction/dto/send-gift.dto.ts
import { IsInt, Min, IsString, IsIn } from 'class-validator';

/**
 * DTO for gifting a post.
 * - giftType: must be one of the supported catalog keys
 * - amount  : how many units (min 1)
 */
export class SendGiftDto {
  @IsString()
  @IsIn(['rose', 'diamond', 'gold'], {
    message: 'giftType is invalid',
  })
  giftType: string;

  @IsInt({ message: 'amount must be an integer' })
  @Min(1, { message: 'amount must be at least 1' })
  amount: number;
}
