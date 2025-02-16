import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { FileDto } from '../../files/dto/file.dto';

export class AuthGoogleDto {
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'test1@example.com',
    description: 'The Google account email address.',
  })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'First name obtained from the Google profile.',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name obtained from the Google profile.',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'URL of the profile photo obtained from the Google profile.',
  })
  @IsNotEmpty()
  photo: FileDto;
}
