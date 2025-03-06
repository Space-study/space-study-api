import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBlogCommentDto {
  @ApiProperty({
    example: 'This is an updated comment.',
    description: 'The content of the comment',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
