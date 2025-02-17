import { ApiProperty } from '@nestjs/swagger';
import { GetBackgroundResponse } from './get-background.response';

export class GetAllBackgroundsResponse {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful.',
  })
  success: boolean;

  @ApiProperty({
    type: [GetBackgroundResponse],
    description: 'List of all backgrounds.',
  })
  backgrounds: GetBackgroundResponse[];

  @ApiProperty({
    example: 10,
    description: 'Total number of backgrounds found.',
  })
  total: number;
}
