import { Message } from '../../../../domain/message';
import { MessageEntity } from '../entities/message.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RoomOrmEntity } from '../../../../../room/infrastructure/persistence/room-om.entity';
import { User } from '../../../../../users/domain/user';
import { Room } from '../../../../../room/domain/entities/room.entity';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const message = new Message();
    message.id = raw.id;
    message.content = raw.content;
    message.isAiGenerated = raw.isAiGenerated || false;

    if (raw.user) {
      const user = new User();
      user.id = raw.user.id;
      user.email = raw.user.email;
      user.firstName = raw.user.firstName;
      user.lastName = raw.user.lastName;
      message.user = user;
    }

    message.rooms = (raw.rooms || []).map((roomEntity) => {
      return new Room(
        Number(roomEntity.id),
        roomEntity.name,
        roomEntity.privacy,
        roomEntity.max_members,
        roomEntity.image_url,
        roomEntity.category,
        roomEntity.created_at,
        roomEntity.status,
        roomEntity.invite_link || '',
        roomEntity.owner_id || 0,
      );
    });

    message.createdAt = raw.createdAt;
    message.updatedAt = raw.updatedAt;
    return message;
  }

  static toPersistence(message: Message): MessageEntity {
    const entity = new MessageEntity();
    if (message.id) {
      entity.id = message.id;
    }

    entity.content = message.content;
    entity.isAiGenerated =
      typeof message.isAiGenerated === 'boolean'
        ? message.isAiGenerated
        : false;

    if (message.user) {
      const userEntity = new UserEntity();
      userEntity.id = Number(message.user.id);
      entity.user = userEntity;
    }

    entity.rooms = message.rooms
      ? message.rooms.map((room) => {
          const roomEntity = new RoomOrmEntity();
          roomEntity.id = room.getId();
          return roomEntity;
        })
      : [];

    if (message.createdAt) {
      entity.createdAt = message.createdAt;
    }

    if (message.updatedAt) {
      entity.updatedAt = message.updatedAt;
    }

    return entity;
  }
}
