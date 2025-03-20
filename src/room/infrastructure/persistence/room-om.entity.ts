import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectEntity } from '../../../projects/infrastructure/persistence/relational/entities/project.entity';

@Entity('rooms')
export class RoomOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['public', 'private'], default: 'public' })
  privacy: 'public' | 'private';

  @Column()
  max_members: number;

  @Column()
  image_url: string;

  @Column()
  category: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'ban', 'pending'],
    default: 'pending',
  })
  status: 'active' | 'ban' | 'pending';

  @Column({ nullable: true })
  invite_link?: string;

  @OneToMany(() => ProjectEntity, (project) => project.room)
  projects: ProjectEntity[];
}
