import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('blog_comments')
export class BlogComment {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column()
  blog_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
