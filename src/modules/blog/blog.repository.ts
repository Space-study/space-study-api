import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '../../common/base/base.abstract.repository';
import { Blog } from './entities/blog.entity';
import { BlogInterfaceRepository } from './interfaces/blog.interface';

@Injectable()
export class BlogRepository
  extends BaseAbstractRepository<Blog>
  implements BlogInterfaceRepository
{
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {
    super(blogRepository);
  }
}
