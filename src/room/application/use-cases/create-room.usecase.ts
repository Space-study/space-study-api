// application/use-cases/create-room.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { MinioService } from '../../infrastructure/service/minio.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { Room } from '../../domain/entities/room.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    file: Express.Multer.File,
    createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    const imageUrl = await this.minioService.uploadFile(file);

    const room = new Room(
      0,
      createRoomDto.name,
      createRoomDto.privacy,
      createRoomDto.maxMembers,
      imageUrl,
      createRoomDto.category,
      new Date(),
      createRoomDto.status || 'pending',
      createRoomDto.privacy === 'private' ? uuidv4() : null,
      createRoomDto.ownerId,
    );

    return this.roomRepository.create(room);
  }
}
