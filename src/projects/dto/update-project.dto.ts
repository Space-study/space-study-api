import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Updated Project Name', type: String })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Updated owner user ID',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  ownerId?: number;
}
