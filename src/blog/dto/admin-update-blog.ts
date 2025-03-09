import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateBlogDto } from './create-blog.dto';

export class AdminUpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiProperty({
    example: 'published',
    description: 'The status of the blog',
    type: String,
  })
  @IsString()
  status: string;
}
