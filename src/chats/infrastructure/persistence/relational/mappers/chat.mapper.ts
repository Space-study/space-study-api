import { Chat } from '../../../../domain/chat';
import { ChatEntity } from '../entities/chat.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

export class ChatMapper {
  static toDomain(raw: ChatEntity): Chat {
    const chat = new Chat();
    chat.id = raw.id;
    chat.name = raw.name;
    chat.description = raw.description;
    chat.owner = raw.owner;
    chat.participants = raw.participants;
    chat.createdAt = raw.createdAt;
    chat.updatedAt = raw.updatedAt;
    return chat;
  }

  static toPersistence(chat: Chat): ChatEntity {
    const entity = new ChatEntity();
    if (chat.id) {
      entity.id = chat.id;
    }
    entity.name = chat.name;
    entity.description = chat.description || null;
    entity.owner = chat.owner as UserEntity;
    entity.participants = chat.participants as UserEntity[];
    entity.createdAt = chat.createdAt;
    entity.updatedAt = chat.updatedAt;
    return entity;
  }
}
