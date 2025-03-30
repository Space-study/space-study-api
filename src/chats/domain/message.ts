import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Room } from '../../room/domain/entities/room.entity';

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

  @ApiProperty({ type: () => [Room] })
  rooms: Room[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
