import { ApiProperty } from '@nestjs/swagger';
import { GetRoomResponse } from './get-room.response';

export class GetAllRoomsResponse {
  @ApiProperty({
    type: [GetRoomResponse],
    description: 'List of all room records.',
  })
  rooms: GetRoomResponse[];
}
