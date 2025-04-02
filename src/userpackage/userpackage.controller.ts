import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserpackageService } from './userpackage.service';
import { CreateUserpackageDto } from './dto/create-userpackage.dto';
import { UpdateUserpackageDto } from './dto/update-userpackage.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('userpackage')
export class UserpackageController {
  constructor(private readonly userpackageService: UserpackageService) {}

  @Public()
  @Post()
  create(@Body() createUserpackageDto: CreateUserpackageDto) {
    return this.userpackageService.create(createUserpackageDto);
  }

  @Get()
  findAll() {
    return this.userpackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userpackageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserpackageDto: UpdateUserpackageDto,
  ) {
    return this.userpackageService.update(+id, updateUserpackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userpackageService.remove(+id);
  }
}
