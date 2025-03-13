import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateIssueLabelDto {
  @ApiPropertyOptional({ example: 'updated-bug', type: String })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description for bug', type: String })
  @IsOptional()
  description?: string;
}
