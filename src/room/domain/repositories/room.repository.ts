import { Room } from '../entities/room.entity';

export interface RoomRepository {
  create(room: Room): Promise<Room>;
  findById(id: number): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  update(id: number, room: Partial<Room>): Promise<Room>;
  delete(id: number): Promise<void>;
}
