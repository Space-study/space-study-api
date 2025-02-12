import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, Repository } from 'typeorm';

import { ConversationEntity } from '../entities/conversation.entity';

@Injectable()
export class ConversationsRepository {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationEntity: Repository<ConversationEntity>,
  ) {}

  public async findConversation(
    userId: number,
    friendId: number,
  ): Promise<ConversationEntity> {
    const conversation = await this.conversationEntity
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  public async findWithRelations(
    relations: FindManyOptions<ConversationEntity>,
  ): Promise<ConversationEntity[]> {
    return await this.conversationEntity.find(relations);
  }
}
