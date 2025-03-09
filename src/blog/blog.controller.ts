import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  SerializeOptions,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';
import { AdminUpdateBlogDto } from './dto/admin-update-blog';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'blogs',
  version: '1',
})
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOkResponse({
    type: CreateBlogDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @ApiOkResponse({
    type: Blog,
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.blogService.findAll();
  }

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

  @ApiOkResponse({
    type: Blog,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: Request,
  ) {
    return this.blogService.update(+id, updateBlogDto);
  }

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

  @ApiOkResponse({
    type: Blog,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.blogService.remove(+id);
  }
}
