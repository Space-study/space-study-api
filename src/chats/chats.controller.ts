import { Controller, Get } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatsService) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }
}
