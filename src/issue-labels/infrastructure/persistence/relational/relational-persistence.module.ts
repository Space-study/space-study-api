import { Module } from '@nestjs/common';
import { IssueLabelRepository } from '../issue-label.repository';
import { IssueLabelRelationalRepository } from './repositories/issue-label.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueLabelEntity } from './entities/issue-label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IssueLabelEntity])],
  providers: [
    {
      provide: IssueLabelRepository,
      useClass: IssueLabelRelationalRepository,
    },
  ],
  exports: [IssueLabelRepository],
})
export class RelationalIssueLabelPersistenceModule {}
