import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum PackageStatus {
  OPEN = 1,
  LOCKED = 2,
}

@Entity('package')
export class Package {
  @PrimaryGeneratedColumn()
  package_id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  duration: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'enum', enum: PackageStatus, default: PackageStatus.OPEN })
  status: PackageStatus;
}
