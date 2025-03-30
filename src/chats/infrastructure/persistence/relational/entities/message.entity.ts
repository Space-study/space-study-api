import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RoomOrmEntity } from '../../../../../room/infrastructure/persistence/room-om.entity';

@Entity({
  name: 'message',
})
@Index(['createdAt'])
export class MessageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @ManyToMany(() => RoomOrmEntity, (room) => room.messages)
  @JoinTable({
    name: 'chat_participants',
    joinColumn: {
      name: 'message_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
  })
  rooms: RoomOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
