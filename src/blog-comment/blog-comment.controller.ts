import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BlogComment } from './entities/blog-comment.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'blog-comments',
  version: '1',
})
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post()
  @ApiOkResponse({
    type: CreateBlogCommentDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogCommentDto: CreateBlogCommentDto) {
    return this.blogCommentService.create(createBlogCommentDto);
  }

  @Get()
  @ApiOkResponse({
    type: BlogComment,
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.blogCommentService.findAll();
  }

  @ApiOkResponse({
    type: BlogComment,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogCommentService.findOne(+id);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto,
  ) {
    return this.blogCommentService.update(+id, updateBlogCommentDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.blogCommentService.remove(+id);
  }
}
