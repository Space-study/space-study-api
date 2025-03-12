import { ApiProperty } from '@nestjs/swagger';

export class UpdateMusicResponse {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the updated music.',
  })
  id: number;

  @ApiProperty({
    example: 101,
    description: 'ID of the user who updated the music.',
  })
  user_create_id: number;

  @ApiProperty({ example: 5, description: 'ID of the music category.' })
  category_id: number;

  @ApiProperty({
    example: '/music/path/updated_song.mp3',
    description: 'Updated file path of the music.',
  })
  path: string;

  @ApiProperty({
    example: 'My Updated Song',
    description: 'Updated title of the music.',
  })
  title: string;

  @ApiProperty({
    example: '2024-02-11T12:00:00Z',
    description: 'Date when the music was updated.',
  })
  createdAt: Date;
}
