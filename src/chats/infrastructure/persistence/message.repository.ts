import { Message } from '../../domain/message';
import { NullableType } from '../../../utils/types/nullable.type';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class MessageRepository {
  abstract create(
    data: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Message>;

  abstract findById(id: Message['id']): Promise<NullableType<Message>>;

  abstract findByRoomId(
    roomId: number,
    options?: {
      limit?: number;
      before?: Date;
    },
  ): Promise<Message[]>;

  abstract findByRoomIdWithPagination(
    roomId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<[Message[], number]>;

  abstract update(
    id: Message['id'],
    payload: DeepPartial<Message>,
  ): Promise<Message | null>;

  abstract remove(id: Message['id']): Promise<void>;
}
