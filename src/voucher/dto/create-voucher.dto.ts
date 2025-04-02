import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  discount_percentage: number;

  @IsNotEmpty()
  @IsDateString()
  expiry_date: string;

  @IsBoolean()
  is_active: boolean;
}
