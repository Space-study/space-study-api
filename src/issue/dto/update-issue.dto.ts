import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IssueStatus } from '../entities/issue.entity';

export class UpdateIssueDto {
  @IsString()
  @IsOptional()
  reason_title?: string;

  @IsString()
  @IsOptional()
  reason_description?: string;

  @IsEnum([IssueStatus])
  @IsOptional()
  status?: IssueStatus;
}
