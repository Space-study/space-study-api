import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBackgroundDto {
  @IsInt()
  background_id: number;

  @IsOptional()
  @IsInt()
  user_create_id?: number;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail_path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
