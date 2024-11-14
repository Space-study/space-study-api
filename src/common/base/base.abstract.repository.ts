import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { FindAllResponse } from '../types';

import { BaseInterfaceRepository } from './base.interface.repository';

interface HasId {
  id: number;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }
  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }
  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }
  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(
    filter?: object,
    options?: object,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.entity.count({ where: filter }),
      this.entity.find({ where: filter, ...options }),
    ]);

    return {
      count,
      items,
    };
  }

  public async softDelete(id: number): Promise<boolean> {
    const result = await this.entity.softDelete(id);
    return result.affected > 0;
  }

  public async permanentlyRemove(id: number): Promise<boolean> {
    const result = await this.entity.delete(id);
    return result.affected > 0;
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}