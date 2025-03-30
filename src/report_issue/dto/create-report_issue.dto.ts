import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportIssueDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the reporter',
    type: Number,
  })
  @IsNumber()
  reporter_id: number;

  @ApiProperty({
    example: 'Issue Title',
    description: 'The title of the issue',
    type: String,
  })
  @IsString()
  reason_title: string;

  @ApiProperty({
    example: 'Detailed description of the issue',
    description: 'The description of the issue',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  reason_description?: string;
}
