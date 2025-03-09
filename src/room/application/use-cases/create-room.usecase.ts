// application/use-cases/create-room.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { MinioService } from '../../infrastructure/service/minio.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { Room } from '../../domain/entities/room.entity';

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
      0, // ID will be assigned by the database
      createRoomDto.name,
      createRoomDto.privacy,
      createRoomDto.maxMembers,
      imageUrl,
      createRoomDto.category,
      new Date(),
      createRoomDto.status || 'pending', // Use DTO status or default to 'pending'
    );

    return this.roomRepository.create(room);
  }
}
