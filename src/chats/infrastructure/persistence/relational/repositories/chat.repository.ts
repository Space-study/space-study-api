import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MessageEntity } from '../entities/chat.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Chat } from '../../../../domain/chat';
import { ChatRepository } from '../../chat.repository';
import { ChatMapper } from '../mappers/chat.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ChatRelationalRepository implements ChatRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly chatRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Chat): Promise<Chat> {
    const persistenceModel = ChatMapper.toPersistence(data);
    const newEntity = await this.chatRepository.save(
      this.chatRepository.create(persistenceModel),
    );
    return ChatMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Chat[]> {
    const entities = await this.chatRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ChatMapper.toDomain(entity));
  }

  async findById(id: Chat['id']): Promise<NullableType<Chat>> {
    const entity = await this.chatRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? ChatMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Chat['id'][]): Promise<Chat[]> {
    const entities = await this.chatRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ChatMapper.toDomain(entity));
  }

  async update(id: Chat['id'], payload: Partial<Chat>): Promise<Chat> {
    const entity = await this.chatRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.chatRepository.save(
      this.chatRepository.create(
        ChatMapper.toPersistence({
          ...ChatMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ChatMapper.toDomain(updatedEntity);
  }

  async remove(id: Chat['id']): Promise<void> {
    await this.chatRepository.delete(id);
  }
}
