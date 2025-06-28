import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsString()
  @IsNotEmpty()
  mediaUrl: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
