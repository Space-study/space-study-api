import { IssueLabelMapper } from '../../../../../issue-labels/infrastructure/persistence/relational/mappers/issue-label.mapper';
import { ProjectMapper } from '../../../../../projects/infrastructure/persistence/relational/mappers/project.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Issue } from '../../../../domain/issue';
import { IssueEntity } from '../entities/issue.entity';

export class IssueMapper {
  static toDomain(raw: IssueEntity): Issue {
    const domainEntity = new Issue();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;
    domainEntity.status = raw.status;
    domainEntity.timeEstimate = raw.timeEstimate;
    domainEntity.timeSpent = raw.timeSpent;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt || new Date();

    // Map nested relationships via their dedicated mappers
    if (raw.reporter) {
      domainEntity.reporter = UserMapper.toDomain(raw.reporter);
    }
    if (raw.assignee) {
      domainEntity.assignee = UserMapper.toDomain(raw.assignee);
    }
    if (raw.project) {
      domainEntity.project = ProjectMapper.toDomain(raw.project);
    }
    domainEntity.participants = raw.participants
      ? raw.participants.map((p) => UserMapper.toDomain(p))
      : [];
    domainEntity.labels = raw.labels
      ? raw.labels.map((l) => IssueLabelMapper.toDomain(l))
      : [];
    return domainEntity;
  }

  static toPersistence(domainEntity: Issue): IssueEntity {
    const persistenceEntity = new IssueEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.timeEstimate = domainEntity.timeEstimate;
    persistenceEntity.timeSpent = domainEntity.timeSpent;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    // Map nested relationships using their mappers
    if (domainEntity.reporter) {
      persistenceEntity.reporter = UserMapper.toPersistence(
        domainEntity.reporter,
      );
    }
    if (domainEntity.assignee) {
      persistenceEntity.assignee = UserMapper.toPersistence(
        domainEntity.assignee,
      );
    }
    if (domainEntity.project) {
      persistenceEntity.project = ProjectMapper.toPersistence(
        domainEntity.project,
      );
    }
    persistenceEntity.participants = domainEntity.participants
      ? domainEntity.participants.map((p) => UserMapper.toPersistence(p))
      : [];
    persistenceEntity.labels = domainEntity.labels
      ? domainEntity.labels.map((l) => IssueLabelMapper.toPersistence(l))
      : [];
    return persistenceEntity;
  }
}
