import { IsNumber, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsNumber()
  orderCode: number;

  @IsString()
  key: string;
}
