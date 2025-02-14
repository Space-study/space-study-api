import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicOrmEntity } from './infrastructure/persistence/music-orm.entity';
import { MusicRepositoryImpl } from './infrastructure/repositories/music.repository.impl';
import { MusicService } from './application/services/music.service';
import { MusicController } from './music.controller';
import { CreateMusicUseCase } from './application/use-cases/create-music.usecase';
import { GetMusicUseCase } from './application/use-cases/get-music.usecase';
import { UpdateMusicUseCase } from './application/use-cases/update-music.usecase';
import { DeleteMusicUseCase } from './application/use-cases/delete-music.usecase';
import { MinioService } from './infrastructure/services/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([MusicOrmEntity])],
  controllers: [MusicController],
  providers: [
    MusicService,
    { provide: 'MusicRepository', useClass: MusicRepositoryImpl },
    CreateMusicUseCase,
    GetMusicUseCase,
    UpdateMusicUseCase,
    DeleteMusicUseCase,
    MinioService
  ],
  exports: [
    MusicService,
    CreateMusicUseCase,
    GetMusicUseCase,
    UpdateMusicUseCase,
    DeleteMusicUseCase,
  ],
})
export class MusicModule {}
