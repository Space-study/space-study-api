import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { MessageEntity } from './entities/message.entity';
import { ChatRepository } from '../chat.repository';
import { MessageRepository } from '../message.repository';
import { ChatRelationalRepository } from './repositories/chat.repository';
import { MessageRelationalRepository } from './repositories/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, MessageEntity])],
  providers: [
    {
      provide: ChatRepository,
      useClass: ChatRelationalRepository,
    },
    {
      provide: MessageRepository,
      useClass: MessageRelationalRepository,
    },
  ],
  exports: [ChatRepository, MessageRepository],
})
export class RelationalChatPersistenceModule {}
