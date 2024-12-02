import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';

export const infinityPagination = <T>(payload: T[], options: IPaginationOptions): InfinityPaginationResponseDto<T> => {
  return {
    payload,
    hasNextPage: payload.length === options.limit,
  };
};
