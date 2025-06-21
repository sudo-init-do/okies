import { IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 30, {
    message: 'Display name must be between 3 and 30 characters',
  })
  displayName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160, { message: 'Bio must be at most 160 characters' })
  bio?: string;
}
