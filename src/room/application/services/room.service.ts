import { Injectable } from '@nestjs/common';
import { CreateRoomUseCase } from '../use-cases/create-room.usecase';
import { DeleteRoomUseCase } from '../use-cases/delete-room.usecase';
import { GetRoomUseCase } from '../use-cases/get-room.usecase';
import { UpdateRoomUseCase } from '../use-cases/update-room.usecase';
import { JoinRoomUseCase } from '../use-cases/join-room.usecase';
import { GetRoomByUserIdUseCase } from '../use-cases/get-room-by-userid.usecase';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { Room } from '../../domain/entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
    private readonly getRoomUseCase: GetRoomUseCase,
    private readonly updateRoomUseCase: UpdateRoomUseCase,
    private readonly joinRoomUseCase: JoinRoomUseCase,
    private readonly findUserByIdUseCase: GetRoomByUserIdUseCase,
  ) {}

  async create(file: Express.Multer.File, body: any): Promise<Room> {
    const createRoomDto = new CreateRoomDto();
    createRoomDto.name = body.name;
    createRoomDto.privacy = body.privacy;
    createRoomDto.maxMembers = Number(body.maxMembers);
    createRoomDto.category = body.category;
    createRoomDto.ownerId = Number(body.ownerId);

    return this.createRoomUseCase.execute(file, createRoomDto);
  }

  async findAll(): Promise<Room[]> {
    return this.getRoomUseCase.executeAll();
  }

  async findById(id: number): Promise<Room> {
    return this.getRoomUseCase.execute(id);
  }

  async findByUserId(id: number): Promise<Room> {
    return this.findUserByIdUseCase.execute(id);
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    return this.updateRoomUseCase.execute(id, updateRoomDto);
  }

  async delete(id: number): Promise<void> {
    return this.deleteRoomUseCase.execute(id);
  }

  async joinRoom(
    id: number,
    // userId: number,
    inviteLink?: string,
  ): Promise<void> {
    // return this.joinRoomUseCase.execute(id, userId, inviteLink);
    return this.joinRoomUseCase.execute(id, inviteLink);
  }
}
