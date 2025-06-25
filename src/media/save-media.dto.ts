import { IsString } from 'class-validator';

export class SaveMediaDto {
  @IsString()
  key: string;

  @IsString()
  contentType: string;
}
