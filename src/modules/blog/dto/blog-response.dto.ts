import { BlogEntity } from '../entities/blog.entity';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BlogResponseDto extends AbstractDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  content: string;

  @ApiPropertyOptional()
  author: string;

  constructor(blogEntity: BlogEntity) {
    super(blogEntity);
  }
}
