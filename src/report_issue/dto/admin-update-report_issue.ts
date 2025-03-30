import { ApiProperty } from '@nestjs/swagger';
import { IssueStatus_Report } from '../entities/report_issue.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class AdminUpdateReportIssueDto {
  @ApiProperty({
    example: IssueStatus_Report.RESOLVED,
    description:
      'The status of the report issue, e.g., PENDING, RESOLVED, or REJECTED',
    enum: IssueStatus_Report, // Specify the enum directly
    required: false, // Field is optional
  })
  @IsEnum(IssueStatus_Report, {
    message: 'status must be a valid value from IssueStatus_Report enum',
  }) // Validate against the IssueStatus_Report enum
  @IsOptional()
  status?: IssueStatus_Report;
}
