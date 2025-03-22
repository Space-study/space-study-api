import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum IssueStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn()
  report_id: number;

  @Column()
  reporter_id: number;

  @Column()
  reason_title: string;

  @Column({ type: 'text', nullable: true })
  reason_description: string;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.PENDING,
  })
  status: IssueStatus;

  @CreateDateColumn()
  created_at: Date;
}
