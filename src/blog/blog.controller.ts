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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';
import { AdminUpdateBlogDto } from './dto/admin-update-blog';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'blogs',
  version: '1',
})
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: Blog })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Blog Upload',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        author_id: { type: 'integer' },
        category_id: { type: 'integer' },
        title: { type: 'string' },
        content: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Blog successfully created.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMusic(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.blogService.create(file, body);
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
