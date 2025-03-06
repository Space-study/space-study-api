import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../../../domain/message';
import { MessageMapper } from '../mappers/message.mapper';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../../message.repository';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MessageRelationalRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Message): Promise<Message> {
    try {
      console.log(
        'Creating message in repository:',
        JSON.stringify({
          content: data.content,
          chatId: data.chat?.id,
          userId: data.user?.id,
        }),
      );

      const persistenceModel = MessageMapper.toPersistence(data);

      // Ensure content is not null
      if (!persistenceModel.content) {
        console.error('Message content is null or empty');
        throw new Error('Message content cannot be null');
      }

      console.log(
        'Persistence model created:',
        JSON.stringify({
          content: persistenceModel.content,
          chatId: persistenceModel.chat?.id,
          userId: persistenceModel.user?.id,
        }),
      );

      const newEntity = await this.messageRepository.save(
        this.messageRepository.create(persistenceModel),
      );

      console.log('Message saved to database with ID:', newEntity.id);

      return MessageMapper.toDomain(newEntity);
    } catch (error) {
      console.error('Error creating message in repository:', error);
      throw error;
    }
  }

  async findById(id: Message['id']): Promise<NullableType<Message>> {
    const entity = await this.messageRepository.findOne({
      where: { id },
    });

    return entity ? MessageMapper.toDomain(entity) : null;
  }

  async findByChatId(chatId: string): Promise<Message[]> {
    const entities = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'ASC' },
    });

    return entities.map((entity) => MessageMapper.toDomain(entity));
  }

  async update(id: Message['id'], payload: Partial<Message>): Promise<Message> {
    const entity = await this.messageRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Message not found');
    }

    const updatedEntity = await this.messageRepository.save(
      this.messageRepository.create(
        MessageMapper.toPersistence({
          ...MessageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MessageMapper.toDomain(updatedEntity);
  }

  async remove(id: Message['id']): Promise<void> {
    await this.messageRepository.delete(id);
  }

  async findByChatIdWithPagination(
    chatId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<[Message[], number]> {
    const [entities, total] = await this.messageRepository.findAndCount({
      where: { chat: { id: chatId } },
      order: { createdAt: 'DESC' }, // Most recent messages first
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'], // Include user information
    });

    return [entities.map((entity) => MessageMapper.toDomain(entity)), total];
  }
}
