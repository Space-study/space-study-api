// create-package.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { PackageStatus } from '../entities/package.entity';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  duration: number;


  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;
}
