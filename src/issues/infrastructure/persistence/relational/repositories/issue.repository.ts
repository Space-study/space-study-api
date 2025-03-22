import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IssueEntity } from '../entities/issue.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Issue } from '../../../../domain/issue';
import { IssueRepository } from '../../issue.repository';
import { IssueMapper } from '../mappers/issue.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Project } from '../../../../../projects/domain/project';

@Injectable()
export class IssueRelationalRepository implements IssueRepository {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
  ) {}

  async create(data: Issue): Promise<Issue> {
    const persistenceModel = IssueMapper.toPersistence(data);
    const newEntity = await this.issueRepository.save(
      this.issueRepository.create(persistenceModel),
    );
    return IssueMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Issue[]> {
    const entities = await this.issueRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => IssueMapper.toDomain(entity));
  }

  async findById(id: Issue['id']): Promise<NullableType<Issue>> {
    const entity = await this.issueRepository.findOne({
      where: { id: Number(id) },
      relations: ['project', 'reporter', 'assignee', 'participants', 'labels'],
    });

    return entity ? IssueMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Issue['id'][]): Promise<Issue[]> {
    const entities = await this.issueRepository.find({
      where: { id: In(ids) },
      relations: ['project', 'reporter', 'assignee', 'participants', 'labels'],
    });

    return entities.map((entity) => IssueMapper.toDomain(entity));
  }

  async findByProjectId(projectId: Project['id']): Promise<Issue[]> {
    const entities = await this.issueRepository.find({
      where: { project: { id: Number(projectId) } },
      relations: ['project', 'reporter', 'assignee', 'participants', 'labels'],
    });

    return entities.map((entity) => IssueMapper.toDomain(entity));
  }

  async updateIssueStatus(
    id: Issue['id'],
    status: Issue['status'],
  ): Promise<Issue> {
    const entity = await this.issueRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    entity.status = status;

    const updatedEntity = await this.issueRepository.save(entity);

    return IssueMapper.toDomain(updatedEntity);
  }

  async update(id: Issue['id'], payload: Partial<Issue>): Promise<Issue> {
    const entity = await this.issueRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.issueRepository.save(
      this.issueRepository.create(
        IssueMapper.toPersistence({
          ...IssueMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return IssueMapper.toDomain(updatedEntity);
  }

  async remove(id: Issue['id']): Promise<void> {
    await this.issueRepository.delete(id);
  }

  async findByStatus(status: Issue['status']): Promise<Issue[]> {
    const entities = await this.issueRepository.find({
      where: { status },
      relations: ['reporter', 'assignee', 'project', 'participants', 'labels'],
    });
    return entities.map((entity) => IssueMapper.toDomain(entity));
  }
}
