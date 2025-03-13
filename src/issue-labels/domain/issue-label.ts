import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Issue } from '../../issues/domain/issue';

export class IssueLabel {
  @ApiProperty({ type: Number })
  @Expose()
  id: number | string;

  @ApiProperty({ type: String, example: 'bug' })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Indicates a bug in the system',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    type: () => [Issue],
    description: 'Issues tagged with this label',
  })
  @Expose()
  issues: Issue[];

  @ApiProperty({ description: 'Creation date of the label' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date of the label' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Deletion date of the label' })
  @Expose()
  deletedAt: Date;
}
