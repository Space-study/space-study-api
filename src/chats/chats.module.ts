import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './infrastructure/websocket/chat.gateway';
import { RelationalChatPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from './message.service';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    RelationalChatPersistenceModule,
    UsersModule,
    AuthModule,
    RoomModule,
  ],
  controllers: [],
  providers: [ChatGateway, JwtService, MessageService],
  exports: [RelationalChatPersistenceModule, MessageService],
})
export class ChatsModule {}
