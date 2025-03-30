import { Injectable } from '@nestjs/common';
import { Message } from './domain/message';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { User } from '../users/domain/user';
import { Room } from '../room/domain/entities/room.entity';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async create(data: {
    content: string;
    rooms: Room[];
    user: User;
  }): Promise<Message> {
    if (!data.content) {
      throw new Error('Message content is required');
    }

    if (!data.rooms || data.rooms.length === 0) {
      throw new Error('Room is required');
    }

    if (!data.user) {
      throw new Error('User is required');
    }

    const message = new Message();
    message.content = data.content;
    message.rooms = data.rooms;
    message.user = data.user;

    return this.messageRepository.create(message);
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new Error('Message not found');
    }
    return message;
  }

  async findByRoomId(roomId: number): Promise<Message[]> {
    return this.messageRepository.findByRoomId(roomId);
  }

  async findByRoomIdWithPagination(
    roomId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<[Message[], number]> {
    return this.messageRepository.findByRoomIdWithPagination(
      roomId,
      paginationOptions,
    );
  }

  async update(id: string, data: Partial<Message>): Promise<Message | null> {
    const updatedMessage = await this.messageRepository.update(id, data);
    return updatedMessage || null;
  }

  async remove(id: string): Promise<void> {
    return this.messageRepository.remove(id);
  }
}
