import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './infrastructure/websocket/chat.gateway';
import { RelationalChatPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    // import modules, etc.
    RelationalChatPersistenceModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway, JwtService],
  exports: [ChatsService, RelationalChatPersistenceModule],
})
export class ChatsModule {}
