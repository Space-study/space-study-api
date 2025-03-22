import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './infrastructure/persistence/project.repository';
import { Project } from './domain/project';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Room } from '../room/domain/entities/room.entity';
@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.create({
      name: createProjectDto.name,
      owner: { id: createProjectDto.ownerId } as any,
      roomId: createProjectDto.roomId,
    } as Project);
  }

  async findAllWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Project[]> {
    return this.projectRepository.findAllWithPagination({
      paginationOptions,
    });
  }

  findById(id: Project['id']): Promise<NullableType<Project>> {
    return this.projectRepository.findById(id);
  }

  async findByRoomId(roomId: Room['id']): Promise<Project[]> {
    return this.projectRepository.findByRoomId(roomId);
  }

  async update(
    id: Project['id'],
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project | null> {
    const updated = await this.projectRepository.update(id, updateProjectDto);
    if (updated) {
      return await this.projectRepository.findById(id);
    }
    return null;
  }

  async remove(id: Project['id']): Promise<void> {
    await this.projectRepository.remove(id);
  }
}
