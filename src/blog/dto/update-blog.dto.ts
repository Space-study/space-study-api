import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
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
}
