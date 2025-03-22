import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Issue]), UsersModule, FilesModule],
  controllers: [IssueController],
  providers: [IssueService, UsersService],
  exports: [IssueService],
})
export class IssueModule {}
