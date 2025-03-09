// application/use-cases/update-room.usecase.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { Room } from '../../domain/entities/room.entity';

@Injectable()
export class UpdateRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const existingRoom = await this.roomRepository.findById(id);
    if (!existingRoom) throw new NotFoundException('Room not found');

    const roomUpdate: Partial<Room> = {
      ...(updateRoomDto.name !== undefined && { name: updateRoomDto.name }),
      ...(updateRoomDto.privacy !== undefined && {
        privacy: updateRoomDto.privacy,
      }),
      ...(updateRoomDto.maxMembers !== undefined && {
        maxMembers: updateRoomDto.maxMembers,
      }),
      ...(updateRoomDto.category !== undefined && {
        category: updateRoomDto.category,
      }),
      ...(updateRoomDto.status !== undefined && {
        status: updateRoomDto.status,
      }), // Add status
    };

    return this.roomRepository.update(id, roomUpdate);
  }
}
