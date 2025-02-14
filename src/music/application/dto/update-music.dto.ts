import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMusicDto {
  @ApiPropertyOptional({
    example: 5,
    description: 'The ID of the music category to update',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiPropertyOptional({
    example: '/new/path/to/music/file.mp3',
    description: 'The new file path where the music is stored',
    type: String,
  })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({
    example: 'Updated Song Title',
    description: 'The new title of the music',
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string;
}
