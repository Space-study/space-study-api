import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the author who created the blog',
    type: Number,
  })
  @IsNumber()
  author_id: number;

  @ApiProperty({
    example: 2,
    description: 'The ID of the blog category',
    type: Number,
  })
  @IsNumber()
  category_id: number;

  @ApiProperty({
    example: 'My First Blog',
    description: 'The title of the blog',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content of the blog.',
    description: 'The content of the blog',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: '/images/thumbnail.jpg',
    description: 'The path to the thumbnail image',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail_path?: string;

  @ApiProperty({
    example: 'published',
    description: 'The status of the blog',
    type: String,
  })
  @IsString()
  status: string;
}
