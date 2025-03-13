import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IssueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
