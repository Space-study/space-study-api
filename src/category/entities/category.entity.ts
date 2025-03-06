import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon_path: string;
}
