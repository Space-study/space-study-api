import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/base/base.entity';
import { UseDto } from '../../../common/decorators/use-dto.decorator';
import { BlogResponseDto } from '../dto/blog-response.dto';

@Entity()
@UseDto(BlogResponseDto)
export class BlogEntity extends AbstractEntity<BlogResponseDto> {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;
}
