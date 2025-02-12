import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatController } from './chats.controller';
import { RelationalChatPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RedisModule } from '../shared/redis/redis.module';
import { ChatGateway } from './chat.gateway';
@Module({
  imports: [
    // import modules, etc.
    RelationalChatPersistenceModule,
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [ChatsService, ChatGateway],
  exports: [ChatsService, RelationalChatPersistenceModule],
})
export class ChatsModule {}
