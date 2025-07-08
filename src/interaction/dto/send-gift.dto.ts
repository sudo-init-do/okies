import { IsInt, Min, IsString, IsIn } from 'class-validator';
import { GIFT_CATALOG } from '../gift-types.const';

export class SendGiftDto {
  @IsString()
  @IsIn(Object.keys(GIFT_CATALOG), { message: 'giftType is invalid' })
  giftType!: keyof typeof GIFT_CATALOG;

  @IsInt()
  @Min(1)
  amount!: number; // units of the gift
}
