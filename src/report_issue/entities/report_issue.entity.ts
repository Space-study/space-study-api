import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum IssueStatus_Report {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Entity('report_issues')
export class Issue_Report {
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
    enum: IssueStatus_Report,
    default: 'pending',
  })
  status: IssueStatus_Report;

  @CreateDateColumn()
  created_at: Date;
}
