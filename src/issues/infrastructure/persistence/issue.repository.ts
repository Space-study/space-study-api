import { Project } from '../../../projects/domain/project';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Issue } from '../../domain/issue';
export abstract class IssueRepository {
  abstract create(
    data: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Issue>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Issue[]>;

  abstract findById(id: Issue['id']): Promise<NullableType<Issue>>;

  abstract findByIds(ids: Issue['id'][]): Promise<Issue[]>;

  abstract findByProjectId(projectId: Project['id']): Promise<Issue[]>;

  abstract updateIssueStatus(
    id: Issue['id'],
    status: Issue['status'],
  ): Promise<Issue>;

  abstract update(
    id: Issue['id'],
    payload: DeepPartial<Issue>,
  ): Promise<Issue | null>;

  abstract remove(id: Issue['id']): Promise<void>;

  abstract findByStatus(status: Issue['status']): Promise<Issue[]>;
}
