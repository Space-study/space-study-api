import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: 'My Room',
    description: 'The name of the room',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'public',
    description: 'The privacy setting of the room (public or private)',
    enum: ['public', 'private'],
  })
  @IsEnum(['public', 'private'])
  privacy: 'public' | 'private';

  @ApiProperty({
    example: 50,
    description: 'The maximum number of members allowed in the room',
    type: Number,
  })
  @IsNumber()
  maxMembers: number;

  @ApiProperty({
    example: 'General',
    description: 'The category of the room',
    type: String,
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the room (active, ban, or pending)',
    enum: ['active', 'ban', 'pending'],
    default: 'pending',
  })
  @IsOptional()
  @IsEnum(['active', 'ban', 'pending'])
  status?: 'active' | 'ban' | 'pending';
}
