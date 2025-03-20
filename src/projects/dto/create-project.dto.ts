import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateProjectDto {
  @ApiProperty({ example: 'New Project', type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'Owner user ID', type: Number })
  @IsNotEmpty()
  @IsNumber()
  ownerId: number;

  @ApiProperty({ example: 1, description: 'Room ID', type: Number })
  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
