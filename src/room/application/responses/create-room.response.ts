import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomResponse {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the room.',
  })
  id: number;

  @ApiProperty({ example: 'My Room', description: 'Name of the room.' })
  name: string;

  @ApiProperty({
    example: 'public',
    description: 'Privacy setting of the room.',
  })
  privacy: 'public' | 'private';

  @ApiProperty({ example: 50, description: 'Maximum number of members.' })
  maxMembers: number;

  @ApiProperty({
    example: '/image/url.jpg',
    description: 'Image URL of the room.',
  })
  imageUrl: string;

  @ApiProperty({ example: 'General', description: 'Category of the room.' })
  category: string;

  @ApiProperty({
    example: '2025-03-08T10:00:00Z',
    description: 'Date when the room was created.',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the room.',
    enum: ['active', 'ban', 'pending'],
  })
  status: 'active' | 'ban' | 'pending';
}
