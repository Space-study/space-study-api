import { Module } from '@nestjs/common';
import { IssueRepository } from '../issue.repository';
import { IssueRelationalRepository } from './repositories/issue.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from './entities/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity])],
  providers: [
    {
      provide: IssueRepository,
      useClass: IssueRelationalRepository,
    },
  ],
  exports: [IssueRepository],
})
export class RelationalIssuePersistenceModule {}
