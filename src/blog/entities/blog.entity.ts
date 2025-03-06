import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @Column()
  status: string;
}
