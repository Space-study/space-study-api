import { PartialType } from '@nestjs/swagger';
import { CreateUserpackageDto } from './create-userpackage.dto';

export class UpdateUserpackageDto extends PartialType(CreateUserpackageDto) {}
