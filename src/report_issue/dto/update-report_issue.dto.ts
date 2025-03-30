import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportIssueDto {
  @ApiProperty({
    description: 'The title of the reason for the issue',
    example: 'Incorrect data in the report',
    required: false, // Indicates this field is optional
  })
  @IsString()
  @IsOptional()
  reason_title?: string;

  @ApiProperty({
    description: 'A detailed description of the issue reason',
    example: 'The report contains outdated or incorrect information.',
    required: false, // Indicates this field is optional
  })
  @IsString()
  @IsOptional()
  reason_description?: string;
}
