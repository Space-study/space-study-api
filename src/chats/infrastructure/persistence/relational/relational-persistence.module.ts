import { Module } from '@nestjs/common';
import { ChatRepository } from '../chat.repository';
import { ChatRelationalRepository } from './repositories/chat.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/chat.entity';
import { ConversationsRepository } from './repositories/conversations.repository';
@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [
    {
      provide: ChatRepository,
      useClass: ChatRelationalRepository,
    },
    {
      provide: ConversationsRepository,
      useClass: ConversationsRepository,
    },
  ],
  exports: [ChatRepository, ConversationsRepository],
})
export class RelationalChatPersistenceModule {}
