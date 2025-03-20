import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { IssueLabelEntity } from '../../../../../issue-labels/infrastructure/persistence/relational/entities/issue-label.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ProjectEntity } from '../../../../../projects/infrastructure/persistence/relational/entities/project.entity';
import { IssueStatus } from '../../../enum/issue-status.enum';

@Entity({
  name: 'issue',
})
export class IssueEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.OPEN,
  })
  status: IssueStatus;

  /**
   * Simple time tracking fields (in hours or minutes).
   * For a more detailed approach, consider a separate TimeLogEntity.
   */
  @Column({ type: 'int', default: 0 })
  timeEstimate: number;

  @Column({ type: 'int', default: 0 })
  timeSpent: number;

  // The user who reported the issue
  @ManyToOne(() => UserEntity, (user) => user.reportedIssues, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  reporter: UserEntity;

  // The user currently assigned to the issue
  @ManyToOne(() => UserEntity, (user) => user.assignedIssues, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  assignee: UserEntity;

  // The project this issue belongs to
  @ManyToOne(() => ProjectEntity, (project) => project.issues, {
    onDelete: 'CASCADE',
  })
  project: ProjectEntity;

  // Multiple participants can watch or collaborate on the issue
  @ManyToMany(() => UserEntity, { cascade: false })
  @JoinTable({
    name: 'issue_participants', // Junction table name
  })
  participants: UserEntity[];

  // Many-to-many relationship for labels
  @ManyToMany(() => IssueLabelEntity, (label) => label.issues, {
    cascade: true,
  })
  @JoinTable({
    name: 'issue_issue_labels', // Junction table name
  })
  labels: IssueLabelEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
