import { IssueLabel } from '../../../../domain/issue-label';
import { IssueLabelEntity } from '../entities/issue-label.entity';

export class IssueLabelMapper {
  static toDomain(raw: IssueLabelEntity): IssueLabel {
    const domainEntity = new IssueLabel();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt || new Date();
    return domainEntity;
  }

  static toPersistence(domainEntity: IssueLabel): IssueLabelEntity {
    const persistenceEntity = new IssueLabelEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
