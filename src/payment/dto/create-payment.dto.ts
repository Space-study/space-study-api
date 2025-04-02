import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  packageId: number;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  voucherCode?: string;
}
