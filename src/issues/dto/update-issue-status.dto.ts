import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Issue } from '../domain/issue';

export class UpdateIssueStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: Issue['status'];
}
