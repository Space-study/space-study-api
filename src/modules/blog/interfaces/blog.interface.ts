/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BaseInterfaceRepository } from '../../../common/base/base.interface.repository';
import { BlogEntity } from '../entities/blog.entity';

export interface BlogInterfaceRepository
  extends BaseInterfaceRepository<BlogEntity> {}
