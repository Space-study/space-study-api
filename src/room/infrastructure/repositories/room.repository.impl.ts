// infrastructure/repositories/room.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';
import { RoomOrmEntity } from '../persistence/room-om.entity';

@Injectable()
export class RoomRepositoryImpl implements RoomRepository {
  constructor(
    @InjectRepository(RoomOrmEntity)
    private readonly repo: Repository<RoomOrmEntity>,
  ) {}

  async create(room: Room): Promise<Room> {
    const roomOrmEntity = this.repo.create({
      name: room['name'],
      privacy: room['privacy'],
      max_members: room['maxMembers'],
      image_url: room['imageUrl'],
      category: room['category'],
      created_at: room['createdAt'],
      status: room['status'], // Map status
    });

    const saved = await this.repo.save(roomOrmEntity);

    return new Room(
      saved.id,
      saved.name,
      saved.privacy,
      saved.max_members,
      saved.image_url,
      saved.category,
      saved.created_at,
      saved.status, // Map status back
    );
  }

  async findById(id: number): Promise<Room | null> {
    const room = await this.repo.findOne({ where: { id } });
    if (!room) return null;
    return new Room(
      room.id,
      room.name,
      room.privacy,
      room.max_members,
      room.image_url,
      room.category,
      room.created_at,
      room.status, // Map status
    );
  }

  async findAll(): Promise<Room[]> {
    const rooms = await this.repo.find();
    return rooms.map(
      (room) =>
        new Room(
          room.id,
          room.name,
          room.privacy,
          room.max_members,
          room.image_url,
          room.category,
          room.created_at,
          room.status, // Map status
        ),
    );
  }

  async update(id: number, room: Partial<Room>): Promise<Room> {
    const updateData: Partial<RoomOrmEntity> = {};
    if (room['name'] !== undefined) updateData.name = room['name'];
    if (room['privacy'] !== undefined) updateData.privacy = room['privacy'];
    if (room['maxMembers'] !== undefined)
      updateData.max_members = room['maxMembers'];
    if (room['imageUrl'] !== undefined) updateData.image_url = room['imageUrl'];
    if (room['category'] !== undefined) updateData.category = room['category'];
    if (room['status'] !== undefined) updateData.status = room['status'];

    await this.repo.update(id, updateData);
    const updatedRoom = await this.findById(id);
    if (!updatedRoom) throw new Error('Room not found');
    return updatedRoom;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
