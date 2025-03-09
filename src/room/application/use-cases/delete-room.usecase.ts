import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const room = await this.roomRepository.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    return this.roomRepository.delete(id);
  }
}
