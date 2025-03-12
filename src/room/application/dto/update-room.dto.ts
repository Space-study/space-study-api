import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto {
  @ApiPropertyOptional({
    example: 'My Room',
    description: 'The name of the room',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'public',
    description: 'The privacy setting of the room (public or private)',
    enum: ['public', 'private'],
  })
  @IsOptional()
  @IsEnum(['public', 'private'])
  privacy?: 'public' | 'private';

  @ApiPropertyOptional({
    example: 50,
    description: 'The maximum number of members allowed in the room',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  maxMembers?: number;

  @ApiPropertyOptional({
    example: 'General',
    description: 'The category of the room',
    type: String,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'The status of the room (active, ban, or pending)',
    enum: ['active', 'ban', 'pending'],
  })
  @IsOptional()
  @IsEnum(['active', 'ban', 'pending'])
  status?: 'active' | 'ban' | 'pending';
}
