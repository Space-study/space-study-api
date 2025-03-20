import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';
import { RoomOrmEntity } from '../persistence/room-om.entity';
import { v4 as uuidv4 } from 'uuid';

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
      status: room['status'],
      invite_link: room['privacy'] === 'private' ? uuidv4() : '',
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
      saved.status,
      saved.invite_link ?? '',
    );
  }

  async findById(id: number): Promise<Room | null> {
    const room = await this.repo.findOne({ where: { id } });
    return room ? this.mapToDomain(room) : null;
  }

  async findAll(): Promise<Room[]> {
    const rooms = await this.repo.find();
    return rooms.map(this.mapToDomain);
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
    if (room['inviteLink'] !== undefined)
      updateData.invite_link = room['inviteLink'] ?? '';

    await this.repo.update(id, updateData);
    const updatedRoom = await this.findById(id);
    if (!updatedRoom) throw new Error('Room not found');
    return updatedRoom;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  private mapToDomain(roomOrm: RoomOrmEntity): Room {
    return new Room(
      roomOrm.id,
      roomOrm.name,
      roomOrm.privacy,
      roomOrm.max_members,
      roomOrm.image_url,
      roomOrm.category,
      roomOrm.created_at,
      roomOrm.status,
      roomOrm.invite_link ?? '',
    );
  }
}
