import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogResponseDto } from './dto/blog-response.dto';
import { ApiGlobalResponse } from '../../common/decorators/api-global-response.decorators';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiGlobalResponse(BlogResponseDto)
  @ApiOperation({ description: 'Create a new blog' })
  @ApiConflictResponse({ description: 'Blog already exists' })
  @ApiOkResponse({ description: 'Successfully created a new blog' })
  @ApiBadRequestResponse({ description: 'Invalid data input' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post()
  createBlog(
    @Body(ValidationPipe) createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    return this.blogService.createOne(createBlogDto);
  }

  @ApiGlobalResponse(BlogResponseDto)
  @ApiOperation({
    description: 'Retrieve all blogs with filtering and pagination',
  })
  @ApiOkResponse({ description: 'Successfully retrieved blogs' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get()
  findAll(
    @Query('filter') filter?: string | undefined,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<{ count: number; items: BlogResponseDto[] }> {
    const parsedFilter = filter ? JSON.parse(filter) : undefined;
    const options = { take, skip };
    return this.blogService.findAll(parsedFilter, options);
  }

  @ApiGlobalResponse(BlogResponseDto)
  @ApiOperation({ description: 'Retrieve a specific blog by ID' })
  @ApiOkResponse({ description: 'Successfully retrieved the blog' })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiBadRequestResponse({ description: 'Invalid blog ID' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<BlogResponseDto> {
    return this.blogService.findOne(id);
  }

  @ApiGlobalResponse(BlogResponseDto)
  @ApiOperation({ description: 'Update a blog by ID' })
  @ApiOkResponse({ description: 'Successfully updated the blog' })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiBadRequestResponse({ description: 'Invalid data input or blog ID' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Patch(':id')
  updateBlog(
    @Param('id') id: number,
    @Body(ValidationPipe) updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    return this.blogService.update(id, updateBlogDto);
  }

  @ApiOperation({ description: 'Delete a blog by ID' })
  @ApiOkResponse({ description: 'Successfully deleted the blog' })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiBadRequestResponse({ description: 'Invalid blog ID' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Delete(':id')
  removeBlog(@Param('id') id: number): Promise<boolean> {
    return this.blogService.remove(id);
  }
}
