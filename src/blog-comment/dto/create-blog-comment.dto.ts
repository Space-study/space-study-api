import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDefined } from 'class-validator';

export class CreateBlogCommentDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the blog',
    type: Number,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  blog_id: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user',
    type: Number,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'This is a comment.',
    description: 'The comment content',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  comment: string;
}
