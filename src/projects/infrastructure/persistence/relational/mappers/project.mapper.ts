import { Project } from '../../../../domain/project';
import { ProjectEntity } from '../entities/project.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { IssueMapper } from '../../../../../issues/infrastructure/persistence/relational/mappers/issue.mapper';
import { RoomOrmEntity } from '../../../../../room/infrastructure/persistence/room-om.entity';

export class ProjectMapper {
  static toDomain(raw: ProjectEntity): Project {
    const domainEntity = new Project();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt || new Date();

    if (raw.owner) {
      domainEntity.owner = UserMapper.toDomain(raw.owner);
    }
    domainEntity.issues = raw.issues
      ? raw.issues.map((issue) => IssueMapper.toDomain(issue))
      : [];
    domainEntity.roomId = raw.room?.id;
    return domainEntity;
  }

  static toPersistence(domainEntity: Project): ProjectEntity {
    const persistenceEntity = new ProjectEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    // persistenceEntity.deletedAt = domainEntity.deletedAt;

    if (domainEntity.owner) {
      persistenceEntity.owner = UserMapper.toPersistence(domainEntity.owner);
    }
    persistenceEntity.issues = domainEntity.issues
      ? domainEntity.issues.map((issue) => IssueMapper.toPersistence(issue))
      : [];

    if (domainEntity.roomId) {
      persistenceEntity.room = new RoomOrmEntity();
      persistenceEntity.room.id = domainEntity.roomId;
    }

    return persistenceEntity;
  }
}
