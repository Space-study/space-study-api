// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from 'src/user/user.entity';
// import { Category } from 'src/category/category.entity';

// @Entity('backgrounds')
// export class BackgroundOrmEntity {
//   @PrimaryGeneratedColumn()
//   background_id: number;

//   @Column()
//   user_id: number;

//   @Column()
//   category_id: number;

//   @Column({ type: 'nvarchar', length: 255, nullable: true })
//   thumbnail_path: string;

//   @Column({ type: 'nvarchar', length: 255 })
//   title: string;

//   @Column({ type: 'nvarchar', nullable: true })
//   description: string;

//   @ManyToOne(() => User, user => user.backgrounds)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @ManyToOne(() => Category, category => category.backgrounds)
//   @JoinColumn({ name: 'category_id' })
//   category: Category;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('background')
export class BackgroundOrmEntity {
  @PrimaryGeneratedColumn()
  background_id: number;

  @Column()
  user_create_id: number;

  @Column()
  category_id: number;

  @Column({ nullable: true })
  thumbnail_path: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
