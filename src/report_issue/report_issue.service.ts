import { Injectable } from '@nestjs/common';
import { CreateReportIssueDto } from './dto/create-report_issue.dto';
import { UpdateReportIssueDto } from './dto/update-report_issue.dto';
import { Issue_Report } from './entities/report_issue.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUpdateReportIssueDto } from './dto/admin-update-report_issue';

@Injectable()
export class ReportIssueService {
  constructor(
    @InjectRepository(Issue_Report)
    private reportIssueRepository: Repository<Issue_Report>,
  ) {}

  async create(
    createReportIssueDto: CreateReportIssueDto,
  ): Promise<Issue_Report> {
    const reportIssue =
      await this.reportIssueRepository.create(createReportIssueDto);
    return await this.reportIssueRepository.save(reportIssue);
  }

  async findAll(): Promise<any[]> {
    const reportIssues = await this.reportIssueRepository.find();
    return reportIssues;
  }

  async findOne(id: number): Promise<any> {
    const reportIssue = await this.reportIssueRepository.findOne({
      where: { report_id: id },
    });
    if (!reportIssue) {
      return null;
    }
    return reportIssue;
  }

  async update(
    id: number,
    updateReportIssueDto: UpdateReportIssueDto,
  ): Promise<Issue_Report | null> {
    const reportIssue = await this.reportIssueRepository.findOne({
      where: { report_id: id },
    });
    if (!reportIssue) {
      return null;
    }
    await this.reportIssueRepository.update(id, updateReportIssueDto);
    const updatedReport = await this.reportIssueRepository.findOne({
      where: { report_id: id },
    });
    return updatedReport;
  }

  async remove(id: number): Promise<void> {
    const reportIssue = await this.reportIssueRepository.findOne({
      where: { report_id: id },
    });
    if (!reportIssue) {
      return;
    }
    await this.reportIssueRepository.delete(id);
  }

  async adminUpdate(
    id: number,
    adminUpdateReportIssueDto: AdminUpdateReportIssueDto,
  ): Promise<Issue_Report | null> {
    const reportIssue = await this.reportIssueRepository.findOne({
      where: { report_id: id },
    });
    if (!reportIssue) {
      return null;
    }
    await this.reportIssueRepository.update(id, adminUpdateReportIssueDto);
    const updatedReport = await this.reportIssueRepository.findOne({
      where: { report_id: id },
    });
    return updatedReport;
  }
}
