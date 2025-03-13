import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Issue } from '../../issues/domain/issue';

export class Project {
  @ApiProperty({ type: Number })
  @Expose()
  id: number | string;

  @ApiProperty({ type: String, example: 'New Project' })
  @Expose()
  name: string;

  @ApiProperty({ type: () => User, description: 'Owner of the project' })
  @Expose()
  owner: User;

  @ApiProperty({
    type: () => [Issue],
    description: 'Issues related to this project',
  })
  @Expose()
  issues: Issue[];

  @ApiProperty({ description: 'Date when the project was created' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the project was last updated' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Date when the project was deleted' })
  @Expose()
  deletedAt: Date;
}
