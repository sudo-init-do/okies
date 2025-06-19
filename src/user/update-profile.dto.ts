import { IsOptional, IsString, MaxLength } from 'class-validator';

// DTO for updating user profile
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;
}
