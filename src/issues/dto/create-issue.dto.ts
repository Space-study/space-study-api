import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { IssueStatus } from '../infrastructure/enum/issue-status.enum';

export class CreateIssueDto {
  @ApiProperty({ example: 'Issue Title', type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Detailed description of the issue', type: String })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: IssueStatus, example: IssueStatus.OPEN })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @ApiProperty({
    example: 8,
    description: 'Estimated time in hours',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  timeEstimate?: number;

  @ApiProperty({ example: 3, description: 'Time spent in hours', type: Number })
  @IsNumber()
  @IsOptional()
  timeSpent?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Reporter user ID',
    type: Number,
  })
  @IsOptional()
  reporterId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Assignee user ID',
    type: Number,
  })
  @IsOptional()
  assigneeId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Project ID the issue belongs to',
    type: Number,
  })
  @IsOptional()
  projectId?: number;

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Array of participant user IDs',
    type: [Number],
  })
  @IsOptional()
  participantIds?: number[];

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Array of label IDs',
    type: [Number],
  })
  @IsOptional()
  labelIds?: number[];
}
