import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBackgroundDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'User ID who created the background',
  })
  @IsOptional()
  @IsInt()
  user_create_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Category ID of the background',
  })
  @IsOptional()
  @IsInt()
  category_id?: number;

  @ApiPropertyOptional({
    example: 'path/to/thumbnail.jpg',
    description: 'Path to background thumbnail',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail_path?: string;

  @ApiPropertyOptional({
    example: 'Beautiful Sunset',
    description: 'Title of the background',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example: 'A stunning sunset view',
    description: 'Description of the background',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
