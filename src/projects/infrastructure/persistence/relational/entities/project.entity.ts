import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { IssueEntity } from '../../../../../issues/infrastructure/persistence/relational/entities/issue.entity';
import { RoomOrmEntity } from '../../../../../room/infrastructure/persistence/room-om.entity';

@Entity({
  name: 'project',
})
export class ProjectEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // The user who owns this project
  @ManyToOne(() => UserEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity;

  // A project can have many issues
  @OneToMany(() => IssueEntity, (issue) => issue.project)
  issues: IssueEntity[];

  @ManyToOne(() => RoomOrmEntity, (room) => room.projects)
  room: RoomOrmEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
