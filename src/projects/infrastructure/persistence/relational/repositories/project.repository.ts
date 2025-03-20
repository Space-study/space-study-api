import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Project } from '../../../../domain/project';
import { ProjectRepository } from '../../project.repository';
import { ProjectMapper } from '../mappers/project.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Room } from '../../../../../room/domain/entities/room.entity';
import { UpdateProjectDto } from '../../../../dto/update-project.dto';

@Injectable()
export class ProjectRelationalRepository implements ProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async create(data: Project): Promise<Project> {
    const persistenceModel = ProjectMapper.toPersistence(data);
    const newEntity = await this.projectRepository.save(
      this.projectRepository.create(persistenceModel),
    );
    return ProjectMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Project[]> {
    const entities = await this.projectRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ProjectMapper.toDomain(entity));
  }

  async findById(id: Project['id']): Promise<NullableType<Project>> {
    const entity = await this.projectRepository.findOne({
      where: { id: Number(id) },
      relations: ['owner', 'issues'],
    });

    return entity ? ProjectMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Project['id'][]): Promise<Project[]> {
    const entities = await this.projectRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ProjectMapper.toDomain(entity));
  }

  async findByRoomId(roomId: Room['id']): Promise<Project[]> {
    const entities = await this.projectRepository.find({
      where: { room: { id: roomId } },
    });

    return entities.map((entity) => ProjectMapper.toDomain(entity));
  }

  async update(id: Project['id'], payload: UpdateProjectDto): Promise<Project> {
    const entity = await this.projectRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.projectRepository.save(
      this.projectRepository.create(
        ProjectMapper.toPersistence({
          ...ProjectMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ProjectMapper.toDomain(updatedEntity);
  }

  async remove(id: Project['id']): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
