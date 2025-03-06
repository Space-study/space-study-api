import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class Chat {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'My Chat Room',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'A place to discuss topics',
    required: false,
  })
  description?: string | null;

  @ApiProperty({ type: () => User })
  owner: User;

  @ApiProperty({ type: () => [User] })
  participants: User[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
