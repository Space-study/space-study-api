import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Chat } from './chat';

export class Message {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  content: string;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Chat })
  chat: Chat;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
