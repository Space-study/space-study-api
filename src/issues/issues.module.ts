import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { RelationalIssuePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { IssueLabelsModule } from '../issue-labels/issue-labels.module';
import { forwardRef } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalIssuePersistenceModule,
    forwardRef(() => IssueLabelsModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService, RelationalIssuePersistenceModule],
})
export class IssuesModule {}
