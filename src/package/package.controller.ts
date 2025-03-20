import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'package',
  version: '1',
})
@ApiTags('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Public()
  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packageService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.packageService.remove(id);
  }
}
