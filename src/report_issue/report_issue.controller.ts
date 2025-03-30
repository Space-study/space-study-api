import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import { ReportIssueService } from './report_issue.service';
import { CreateReportIssueDto } from './dto/create-report_issue.dto';
import { UpdateReportIssueDto } from './dto/update-report_issue.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminUpdateReportIssueDto } from './dto/admin-update-report_issue';

@Controller({
  path: 'report-issue',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ReportIssueController {
  constructor(private readonly reportIssueService: ReportIssueService) {}

  @Post()
  create(@Body() createReportIssueDto: CreateReportIssueDto) {
    return this.reportIssueService.create(createReportIssueDto);
  }

  @Get()
  findAll() {
    return this.reportIssueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportIssueService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReportIssueDto: UpdateReportIssueDto,
  ) {
    return this.reportIssueService.update(+id, updateReportIssueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportIssueService.remove(+id);
  }

  @Patch('admin-update/:id')
  @SerializeOptions({
    groups: ['admin'],
  })
  adminUpdate(
    @Param('id') id: string,
    @Body() adminUpdateReportIssueDto: AdminUpdateReportIssueDto,
  ) {
    return this.reportIssueService.adminUpdate(+id, adminUpdateReportIssueDto);
  }
}
