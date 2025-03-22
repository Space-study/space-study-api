import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateIssueLabelDto {
  @ApiProperty({ example: 'bug', type: String })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Indicates a bug in the system',
    type: String,
  })
  @IsOptional()
  description?: string;
}
