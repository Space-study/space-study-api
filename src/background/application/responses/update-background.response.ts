import { ApiProperty } from '@nestjs/swagger';

export class UpdateBackgroundResponse {
  @ApiProperty({
    example: true,
    description: 'Indicates if the update was successful.',
  })
  success: boolean;

  @ApiProperty({
    example: 'Background updated successfully.',
    description: 'Message detailing the update operation result.',
  })
  message: string;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the updated background.',
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
    description: 'Updated thumbnail path of the background image.',
  })
  thumbnail_path: string;

  @ApiProperty({
    example: 'Updated Sunset View',
    description: 'Updated title of the background.',
  })
  title: string;

  @ApiProperty({
    example: 'An updated stunning sunset view over the mountains.',
    description: 'Updated description of the background.',
  })
  description: string;

  @ApiProperty({
    example: '2024-02-11T10:00:00Z',
    description: 'Date when the background was created.',
  })
  created_at: Date;
}
