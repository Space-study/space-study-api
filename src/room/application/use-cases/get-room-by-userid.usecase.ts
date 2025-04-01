import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';

@Injectable()
export class GetRoomByUserIdUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(id: number): Promise<Room> {
    const room = await this.roomRepository.findByUserId(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async executeAll(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }
}
