//make relation ship
// // src/music/infrastructure/persistence/music.orm-entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
// import { User } from '../../../users/infrastructure/persistence/user.orm-entity';
// import { Category } from '../../../categories/infrastructure/persistence/category.orm-entity';

// @Entity('Music')
// export class MusicOrmEntity {
//   @PrimaryGeneratedColumn()
//   music_id: number;

//   @ManyToOne(() => User)
//   user_create_id: number;

//   @ManyToOne(() => Category)
//   category_id: number;

//   @Column()
//   path: string;

//   @Column()
//   title: string;

//   @CreateDateColumn()
//   created_at: Date;
// }


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('music')
export class MusicOrmEntity {
  @PrimaryGeneratedColumn()
  music_id: number;

  // Remove relationships and treat them as simple foreign keys
  @Column()
  user_create_id: number;

  @Column()
  category_id: number;

  @Column()
  path: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;
}
