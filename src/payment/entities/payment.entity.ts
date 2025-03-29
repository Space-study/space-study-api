import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderCode: number;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  key: string;

  @CreateDateColumn()
  createdAt: Date;
}
