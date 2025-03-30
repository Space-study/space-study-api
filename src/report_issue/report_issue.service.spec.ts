import { Test, TestingModule } from '@nestjs/testing';
import { ReportIssueService } from './report_issue.service';

describe('ReportIssueService', () => {
  let service: ReportIssueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportIssueService],
    }).compile();

    service = module.get<ReportIssueService>(ReportIssueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
