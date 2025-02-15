import { ApiProperty } from '@nestjs/swagger';

export class GetMusicResponse {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the music.',
  })
  id: number;

  @ApiProperty({
    example: 101,
    description: 'ID of the user who created the music.',
  })
  user_create_id: number;

  @ApiProperty({ example: 5, description: 'ID of the music category.' })
  category_id: number;

  @ApiProperty({
    example: '/music/path/song.mp3',
    description: 'File path of the music.',
  })
  path: string;

  @ApiProperty({
    example: 'My Awesome Song',
    description: 'Title of the music.',
  })
  title: string;

  @ApiProperty({
    example: '2024-02-11T10:00:00Z',
    description: 'Date when the music was created.',
  })
  createdAt: Date;
}
