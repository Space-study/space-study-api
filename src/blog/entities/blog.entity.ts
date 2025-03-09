import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BlogComment } from '../../blog-comment/entities/blog-comment.entity';

export enum BlogStatus {
  ACCEPTED = 'accepted',
  NOT_ACCEPTED = 'not accepted',
}

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  blog_id: number;

  @Column()
  author_id: number;

  @Column()
  category_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  thumbnail_path: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.NOT_ACCEPTED,
  })
  status: BlogStatus;

  @OneToMany(() => BlogComment, (comment) => comment.blog)
  comments: BlogComment[];
}
