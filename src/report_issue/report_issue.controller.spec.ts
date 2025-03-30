import { Test, TestingModule } from '@nestjs/testing';
import { ReportIssueController } from './report_issue.controller';
import { ReportIssueService } from './report_issue.service';

describe('ReportIssueController', () => {
  let controller: ReportIssueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportIssueController],
      providers: [ReportIssueService],
    }).compile();

    controller = module.get<ReportIssueController>(ReportIssueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
