import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IssueLabelEntity } from '../entities/issue-label.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IssueLabel } from '../../../../domain/issue-label';
import { IssueLabelRepository } from '../../issue-label.repository';
import { IssueLabelMapper } from '../mappers/issue-label.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class IssueLabelRelationalRepository implements IssueLabelRepository {
  constructor(
    @InjectRepository(IssueLabelEntity)
    private readonly issueLabelRepository: Repository<IssueLabelEntity>,
  ) {}

  async create(data: IssueLabel): Promise<IssueLabel> {
    const persistenceModel = IssueLabelMapper.toPersistence(data);
    const newEntity = await this.issueLabelRepository.save(
      this.issueLabelRepository.create(persistenceModel),
    );
    return IssueLabelMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<IssueLabel[]> {
    const entities = await this.issueLabelRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => IssueLabelMapper.toDomain(entity));
  }

  async findById(id: IssueLabel['id']): Promise<NullableType<IssueLabel>> {
    const entity = await this.issueLabelRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? IssueLabelMapper.toDomain(entity) : null;
  }

  async findByIds(ids: IssueLabel['id'][]): Promise<IssueLabel[]> {
    const entities = await this.issueLabelRepository.find({
      where: { id: In(ids.map(Number)) },
    });

    return entities.map((entity) => IssueLabelMapper.toDomain(entity));
  }

  async update(
    id: IssueLabel['id'],
    payload: Partial<IssueLabel>,
  ): Promise<IssueLabel> {
    const entity = await this.issueLabelRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.issueLabelRepository.save(
      this.issueLabelRepository.create(
        IssueLabelMapper.toPersistence({
          ...IssueLabelMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return IssueLabelMapper.toDomain(updatedEntity);
  }

  async remove(id: IssueLabel['id']): Promise<void> {
    await this.issueLabelRepository.delete(id);
  }
}
