/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BaseInterfaceRepository } from '../../../common/base/base.interface.repository';
import { Blog } from '../entities/blog.entity';

export interface BlogInterfaceRepository
  extends BaseInterfaceRepository<Blog> {}
