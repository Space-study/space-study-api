import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { IssueStatus } from '../infrastructure/enum/issue-status.enum';

export class UpdateIssueDto {
  @ApiPropertyOptional({ example: 'Updated Issue Title', type: String })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated detailed description of the issue',
    type: String,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: IssueStatus, example: IssueStatus.IN_PROGRESS })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @ApiPropertyOptional({
    example: 10,
    description: 'Updated estimated time in hours',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  timeEstimate?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Updated time spent in hours',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  timeSpent?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Updated reporter user ID',
    type: Number,
  })
  @IsOptional()
  reporterId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Updated assignee user ID',
    type: Number,
  })
  @IsOptional()
  assigneeId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Updated project ID the issue belongs to',
    type: Number,
  })
  @IsOptional()
  projectId?: number;

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Updated array of participant user IDs',
    type: [Number],
  })
  @IsOptional()
  participantIds?: number[];

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Updated array of label IDs',
    type: [Number],
  })
  @IsOptional()
  labelIds?: number[];
}
