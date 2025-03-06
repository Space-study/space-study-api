import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';

export class CreateChatDto {
  @ApiProperty({ example: 'My Chat Room' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  @ValidateNested()
  @IsNotEmpty()
  owner: UserDto;

  @ApiProperty({ type: [UserDto] })
  @Type(() => UserDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  participants: UserDto[];
}
