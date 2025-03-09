import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomResponse {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the updated room.',
  })
  id: number;

  @ApiProperty({
    example: 'Updated Room',
    description: 'Updated name of the room.',
  })
  name: string;

  @ApiProperty({
    example: 'private',
    description: 'Updated privacy setting of the room.',
  })
  privacy: 'public' | 'private';

  @ApiProperty({
    example: 100,
    description: 'Updated maximum number of members.',
  })
  maxMembers: number;

  @ApiProperty({
    example: '/new/image/url.jpg',
    description: 'Updated image URL of the room.',
  })
  imageUrl: string;

  @ApiProperty({
    example: 'Gaming',
    description: 'Updated category of the room.',
  })
  category: string;

  @ApiProperty({
    example: '2025-03-08T12:00:00Z',
    description: 'Date when the room was updated.',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'active',
    description: 'Status of the room.',
    enum: ['active', 'ban'],
  })
  status: 'active' | 'ban';
}
