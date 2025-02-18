import { ApiProperty } from '@nestjs/swagger';

export class GetBackgroundResponse {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the background.',
  })
  background_id: number;

  @ApiProperty({
    example: 101,
    description: 'ID of the user who created the background.',
  })
  user_create_id: number;

  @ApiProperty({
    example: 5,
    description: 'ID of the background category.',
  })
  category_id: number;

  @ApiProperty({
    example: '/images/backgrounds/bg123.png',
    description: 'Thumbnail path of the background image.',
  })
  thumbnail_path: string;

  @ApiProperty({
    example: 'Beautiful Sunset',
    description: 'Title of the background.',
  })
  title: string;

  @ApiProperty({
    example: 'A stunning sunset view over the mountains.',
    description: 'Description of the background.',
  })
  description: string;

  @ApiProperty({
    example: '2024-02-11T10:00:00Z',
    description: 'Date when the background was created.',
  })
  created_at: Date;
}
