import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  uid: string; // owner (bot or real user)

  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsString()
  @IsNotEmpty()
  mediaUrl: string;

  @IsString()
  @IsNotEmpty()
  contentType: string; // e.g. image/jpeg, video/mp4
}
