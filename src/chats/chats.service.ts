import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './infrastructure/persistence/chat.repository';
// import { Chat } from './domain/chat';
import { User } from '../users/domain/user';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';
import { ConversationsRepository } from './infrastructure/persistence/relational/repositories/conversations.repository';
import { NewMessageDTO } from './dto/new-message.dto';

@Injectable()
export class ChatsService {
  messagesRepository: any;
  constructor(
    // Dependencies here
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    private readonly conversationRepository: ConversationsRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getConversations(userId: number) {
    const allConversations =
      await this.conversationRepository.findWithRelations({
        relations: ['users'],
      });

    const userConversations = allConversations.filter((conversation) => {
      const userIds = conversation.users.map((user) => user.id);
      return userIds.includes(userId);
    });

    return userConversations.map((conversation) => ({
      id: conversation.id,
      userIds: (conversation?.users ?? []).map((user) => user.id),
    }));
  }

  async createConversation(userId: User['id'], friendId: User['id']) {
    const user = await this.userRepository.findById(userId);
    const friend = await this.userRepository.findById(friendId);

    if (!user || !friend) {
      throw new NotFoundException('User or friend not found');
    }

    const conversation = await this.conversationRepository.findConversation(
      Number(userId),
      Number(friendId),
    );

    return conversation;
  }

  async createMessage(userId: User['id'], newMessage: NewMessageDTO) {
    const user = await this.userRepository.findById(userId);

    if (!user) return;

    const conversation = await this.conversationRepository.findConversation(
      Number(userId),
      Number(newMessage.conversationId),
    );

    if (!conversation) return;

    return await this.messagesRepository.save({
      message: newMessage.message,
      user,
      conversation,
    });
  }
}
