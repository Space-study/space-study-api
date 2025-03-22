import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { IssueStatus } from '../entities/issue.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIssueDto {
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

  @ApiProperty({
    example: 'pending',
    description: 'The status of the issue',
    enum: IssueStatus,
    default: IssueStatus.PENDING,
    required: false,
  })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;
}
