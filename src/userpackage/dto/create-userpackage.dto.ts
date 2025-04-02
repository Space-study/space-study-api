import { IsNumber } from 'class-validator'

export class CreateUserpackageDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  package_id: number;
}
