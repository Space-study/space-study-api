import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomOrmEntity } from './infrastructure/persistence/room-om.entity';
import { RoomRepositoryImpl } from './infrastructure/repositories/room.repository.impl';
import { RoomService } from './application/services/room.service';
import { RoomController } from './room.controller';
import { CreateRoomUseCase } from './application/use-cases/create-room.usecase';
import { GetRoomUseCase } from './application/use-cases/get-room.usecase';
import { UpdateRoomUseCase } from './application/use-cases/update-room.usecase';
import { DeleteRoomUseCase } from './application/use-cases/delete-room.usecase';
import { JoinRoomUseCase } from './application/use-cases/join-room.usecase';
import { MinioService } from './infrastructure/service/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomOrmEntity])],
  controllers: [RoomController],
  providers: [
    RoomService,
    { provide: 'RoomRepository', useClass: RoomRepositoryImpl },
    CreateRoomUseCase,
    GetRoomUseCase,
    UpdateRoomUseCase,
    DeleteRoomUseCase,
    JoinRoomUseCase,
    MinioService,
  ],
  exports: [
    RoomService,
    CreateRoomUseCase,
    GetRoomUseCase,
    UpdateRoomUseCase,
    DeleteRoomUseCase,
    JoinRoomUseCase,
  ],
})
export class RoomModule {}
