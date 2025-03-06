import {
  Injectable,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { Chat } from './domain/chat';
import { Message } from './domain/message';
import { User } from '../users/domain/user';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UsersService } from '../users/users.service';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ChatRepository } from './infrastructure/persistence/chat.repository';
import { MessageRepository } from './infrastructure/persistence/message.repository';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly usersService: UsersService,
    private readonly messageRepository: MessageRepository,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const owner = await this.usersService.findById(createChatDto.owner.id);
    if (!owner) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          owner: 'notExists',
        },
      });
    }

    const participants = await this.usersService.findByIds(
      createChatDto.participants.map((p) => p.id),
    );
    if (participants.length !== createChatDto.participants.length) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          participants: 'someParticipantsNotFound',
        },
      });
    }

    return this.chatRepository.create({
      name: createChatDto.name,
      description: createChatDto.description,
      owner,
      participants,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.chatRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Chat['id']) {
    return this.chatRepository.findById(id);
  }

  findByIds(ids: Chat['id'][]) {
    return this.chatRepository.findByIds(ids);
  }

  async update(
    id: Chat['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateChatDto: UpdateChatDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.chatRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Chat['id']) {
    return this.chatRepository.remove(id);
  }

  findUserChats(userId: User['id']): Promise<Chat[]> {
    return this.chatRepository.findUserChats(userId);
  }

  async createMessage(data: {
    chatId: string;
    content: string;
    userId: string;
  }): Promise<Message> {
    // Validate input data
    if (!data.content) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          content: 'contentRequired',
        },
      });
    }

    const chat = await this.findById(data.chatId);
    if (!chat) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          chat: 'notExists',
        },
      });
    }

    const user = await this.usersService.findById(data.userId);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }

    // Create a new Message object with all required properties
    const message = new Message();
    message.content = data.content;
    message.chat = chat;
    message.user = user;

    return this.messageRepository.create(message);
  }

  async getChatMessages({
    chatId,
    paginationOptions,
  }: {
    chatId: string;
    paginationOptions: IPaginationOptions;
  }) {
    // Verify the chat exists
    const chat = await this.findById(chatId);
    if (!chat) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          chat: 'notExists',
        },
      });
    }

    // Get messages with pagination
    const [messages, total] =
      await this.messageRepository.findByChatIdWithPagination(
        chatId,
        paginationOptions,
      );

    return {
      content: messages,
      meta: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        total,
        totalPages: Math.ceil(total / paginationOptions.limit),
      },
    };
  }

  async addParticipant(chatId: string, userId: string): Promise<void> {
    const chat = await this.findById(chatId);
    if (!chat) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          chat: 'notExists',
        },
      });
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }

    // Check if user is already a participant
    const isParticipant = chat.participants.some((p) => p.id === userId);
    if (!isParticipant) {
      chat.participants.push(user);
      await this.chatRepository.update(chat.id, chat);
    }
  }

  async removeParticipant(chatId: string, userId: string): Promise<void> {
    const chat = await this.findById(chatId);
    if (!chat) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          chat: 'notExists',
        },
      });
    }

    // Remove user from participants array
    chat.participants = chat.participants.filter((p) => p.id !== userId);
    await this.chatRepository.update(chat.id, chat);
  }
}
