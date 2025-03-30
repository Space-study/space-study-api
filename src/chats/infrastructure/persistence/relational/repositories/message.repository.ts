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
export class MessageRelationalRepository extends MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {
    super();
  }

  async create(data: Message): Promise<Message> {
    const persistenceModel = MessageMapper.toPersistence(data);

    if (!persistenceModel.content) {
      throw new Error('Message content cannot be null');
    }

    const newEntity = await this.messageRepository.save(
      this.messageRepository.create(persistenceModel),
    );

    return MessageMapper.toDomain(newEntity);
  }

  async findById(id: Message['id']): Promise<NullableType<Message>> {
    const entity = await this.messageRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });

    return entity ? MessageMapper.toDomain(entity) : null;
  }

  async findByRoomId(roomId: number): Promise<Message[]> {
    const entities = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.rooms', 'room')
      .leftJoinAndSelect('message.user', 'user')
      .where('room.id = :roomId', { roomId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return entities.map((entity) => MessageMapper.toDomain(entity));
  }

  async update(id: Message['id'], payload: Partial<Message>): Promise<Message> {
    const entity = await this.messageRepository.findOne({
      where: { id },
      relations: ['rooms'],
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

  async findByRoomIdWithPagination(
    roomId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<[Message[], number]> {
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.rooms', 'room')
      .leftJoinAndSelect('message.user', 'user')
      .where('room.id = :roomId', { roomId })
      .orderBy('message.createdAt', 'DESC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return [entities.map((entity) => MessageMapper.toDomain(entity)), total];
  }
}
