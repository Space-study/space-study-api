import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SerializeOptions,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';
import { AdminUpdateBlogDto } from './dto/admin-update-blog';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';

@Controller({
  path: 'blogs',
  version: '1',
})
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: CreateBlogDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Public()
  @Get()
  @ApiOkResponse({
    type: Blog,
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.blogService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: Blog,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: Blog,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiOkResponse({
    type: Blog,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch('admin/:id')
  @HttpCode(HttpStatus.OK)
  adminUpdate(
    @Param('id') id: string,
    @Body() adminUpdateBlogDto: AdminUpdateBlogDto,
  ) {
    return this.blogService.adminUpdate(+id, adminUpdateBlogDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: Blog,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
