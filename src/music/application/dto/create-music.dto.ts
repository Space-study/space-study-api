import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMusicDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the music',
    type: Number,
  })
  @IsNumber()
  user_create_id: number;

  @ApiProperty({
    example: 5,
    description: 'The ID of the music category',
    type: Number,
  })
  @IsNumber()
  category_id: number;

  @ApiProperty({
    example: 'Awesome Song',
    description: 'The title of the music',
    type: String,
  })
  @IsString()
  title: string;
}
