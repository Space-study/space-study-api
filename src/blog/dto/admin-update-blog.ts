import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateBlogDto } from './create-blog.dto';
import { BlogStatus } from '../entities/blog.entity';

export class AdminUpdateBlogDto {
  @ApiProperty({
    example: '',
    description: 'The status of the blog',
    type: String,
    required: false,
  })
  @IsString()
  status: BlogStatus;
}
