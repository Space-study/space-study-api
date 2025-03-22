import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsArray } from 'class-validator';

export class QueryIssueDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Optional filters for the query',
    example: {},
  })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Optional sort options for the query',
    example: [],
  })
  @IsOptional()
  @IsArray()
  sort?: any[];
}
