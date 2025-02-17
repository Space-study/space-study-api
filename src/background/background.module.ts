import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackgroundOrmEntity } from './infrastructure/persistence/background-orm.entity';
import { BackgroundRepositoryImpl } from './infrastructure/repositories/background.repository.impl';
import { BackgroundService } from './application/services/background.service';
import { BackgroundController } from './background.controller';
import { CreateBackgroundUseCase } from './application/use-cases/create-background.usecase';
import { GetBackgroundUseCase } from './application/use-cases/get-background.usecase';
import { UpdateBackgroundUseCase } from './application/use-cases/update-background.usecase';
import { DeleteBackgroundUseCase } from './application/use-cases/delete-background.usecase';
import { MinioService } from './infrastructure/services/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([BackgroundOrmEntity])],
  providers: [
    BackgroundService,
    { provide: 'BackgroundRepository', useClass: BackgroundRepositoryImpl },
    CreateBackgroundUseCase,
    GetBackgroundUseCase,
    UpdateBackgroundUseCase,
    DeleteBackgroundUseCase,
    MinioService,
  ],
  controllers: [BackgroundController],
  exports: [
    BackgroundService,
    CreateBackgroundUseCase,
    GetBackgroundUseCase,
    UpdateBackgroundUseCase,
    DeleteBackgroundUseCase,
  ],
})
export class BackgroundModule {}
