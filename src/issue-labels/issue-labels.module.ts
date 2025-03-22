import { Module } from '@nestjs/common';
import { IssueLabelsService } from './issue-labels.service';
import { IssueLabelsController } from './issue-labels.controller';
import { RelationalIssueLabelPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { forwardRef } from '@nestjs/common';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalIssueLabelPersistenceModule,
    forwardRef(() => IssuesModule),
  ],
  controllers: [IssueLabelsController],
  providers: [IssueLabelsService],
  exports: [IssueLabelsService, RelationalIssueLabelPersistenceModule],
})
export class IssueLabelsModule {}
