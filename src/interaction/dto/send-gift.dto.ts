import { IsString, IsNotEmpty, IsInt, Min, IsIn } from 'class-validator';

/**
 * DTO for /interact/gift
 * - postId  : the post that receives the gift
 * – giftType: key that must exist in GIFT_CATALOG
 * – amount  : how many units (min 1)
 */
export class SendGiftDto {
  @IsString()
  @IsNotEmpty({ message: 'postId is required' })
  postId: string;

  @IsString()
  @IsIn(['rose', 'diamond', 'gold'], {
    message: 'giftType is invalid',
  }) // adjust to match your catalog keys
  giftType: string;

  @IsInt({ message: 'amount must be an integer' })
  @Min(1, { message: 'amount must be at least 1' })
  amount: number;
}
