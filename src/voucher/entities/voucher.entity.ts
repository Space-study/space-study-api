import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('voucher')
export class Voucher {
  @PrimaryGeneratedColumn()
  voucher_id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'float', nullable: false })
  discount_percentage: number;

  @Column({ type: 'timestamp', nullable: false })
  expiry_date: Date;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
