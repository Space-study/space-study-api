import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { IssueLabel } from '../../domain/issue-label';

export abstract class IssueLabelRepository {
  abstract create(
    data: Omit<IssueLabel, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IssueLabel>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<IssueLabel[]>;

  abstract findById(id: IssueLabel['id']): Promise<NullableType<IssueLabel>>;

  abstract findByIds(ids: IssueLabel['id'][]): Promise<IssueLabel[]>;

  abstract update(
    id: IssueLabel['id'],
    payload: DeepPartial<IssueLabel>,
  ): Promise<IssueLabel | null>;

  abstract remove(id: IssueLabel['id']): Promise<void>;
}
