import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBackgroundDto {
  @IsInt()
  user_create_id: number;

  @IsInt()
  category_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
