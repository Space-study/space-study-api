import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { RelationalProjectPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { forwardRef } from '@nestjs/common';
import { IssueLabelsModule } from '../issue-labels/issue-labels.module';
import { IssuesModule } from '../issues/issues.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalProjectPersistenceModule,
    forwardRef(() => IssuesModule),
    forwardRef(() => IssueLabelsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService, RelationalProjectPersistenceModule],
})
export class ProjectsModule {}
