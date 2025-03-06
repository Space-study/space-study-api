import { Message } from '../../../../domain/message';
import { MessageEntity } from '../entities/message.entity';
import { ChatEntity } from '../entities/chat.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const message = new Message();
    message.id = raw.id;
    message.content = raw.content;
    message.user = raw.user;
    message.chat = raw.chat;
    message.createdAt = raw.createdAt;
    message.updatedAt = raw.updatedAt;
    return message;
  }

  static toPersistence(message: Message): MessageEntity {
    const entity = new MessageEntity();
    if (message.id) {
      entity.id = message.id;
    }

    // Ensure content is explicitly set
    entity.content = message.content;

    entity.user = message.user as UserEntity;
    entity.chat = message.chat as ChatEntity;

    if (message.createdAt) {
      entity.createdAt = message.createdAt;
    }

    if (message.updatedAt) {
      entity.updatedAt = message.updatedAt;
    }

    return entity;
  }
}
