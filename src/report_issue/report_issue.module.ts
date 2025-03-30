import { Module } from '@nestjs/common';
import { ReportIssueService } from './report_issue.service';
import { ReportIssueController } from './report_issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue_Report } from './entities/report_issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue_Report])],
  controllers: [ReportIssueController],
  providers: [ReportIssueService],
})
export class ReportIssueModule {}
