import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BlogStatus } from '../entities/blog.entity';

export class AdminUpdateBlogDto {
  @ApiProperty({
    example: 'accepted',
    description: 'The status of the blog',
    type: String,
    required: false,
  })
  @IsString()
  status: BlogStatus;
}
