import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IssueStatus } from '../infrastructure/enum/issue-status.enum';
import { User } from '../../users/domain/user';
import { Project } from '../../projects/domain/project';
import { IssueLabel } from '../../issue-labels/domain/issue-label';

export class Issue {
  @ApiProperty({ type: Number })
  @Expose()
  id: number | string;

  @ApiProperty({ type: String, example: 'Issue Title' })
  @Expose()
  title: string;

  @ApiProperty({ type: String, example: 'Detailed description of the issue' })
  @Expose()
  description: string;

  @ApiProperty({ enum: IssueStatus, example: IssueStatus.OPEN })
  @Expose()
  status: IssueStatus;

  @ApiProperty({
    type: Number,
    example: 8,
    description: 'Estimated time (e.g., in hours)',
  })
  @Expose()
  timeEstimate: number;

  @ApiProperty({ type: Number, example: 3, description: 'Time spent so far' })
  @Expose()
  timeSpent: number;

  @ApiProperty({ type: () => User, description: 'User who reported the issue' })
  @Expose()
  reporter?: User | null;

  @ApiProperty({
    type: () => User,
    description: 'User assigned to the issue',
    required: false,
  })
  @Expose()
  assignee?: User | null;

  @ApiProperty({
    type: () => Project,
    description: 'Project this issue belongs to',
  })
  @Expose()
  project?: Project | null;

  @ApiProperty({
    type: () => [User],
    description: 'Participants involved in the issue',
  })
  @Expose()
  participants?: User[] | null;

  @ApiProperty({
    type: () => [IssueLabel],
    description: 'Labels associated with the issue',
  })
  @Expose()
  labels?: IssueLabel[];

  @ApiProperty({ description: 'Creation date of the issue' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date of the issue' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Deletion date of the issue' })
  @Expose()
  deletedAt: Date;
}
