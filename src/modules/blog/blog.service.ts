import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogResponseDto } from './dto/blog-response.dto';
import { BlogRepository } from './blog.repository';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class BlogService {
  constructor(
    @Inject(BlogRepository)
    private readonly blogRepository: BlogRepository,
    private readonly logger: LoggerService,
  ) {}

  public async createOne(
    createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    try {
      const newBlog = this.blogRepository.create(createBlogDto);
      this.logger.log(
        'BlogService',
        `Blog created: ${JSON.stringify(newBlog)}`,
      );
      const savedBlog = await this.blogRepository.save(newBlog);
      return new BlogResponseDto(savedBlog);
    } catch (error) {
      throw new Error(`Failed to create blog: ${error.message}`);
    }
  }

  public async findAll(
    filter?: object,
    options?: object,
  ): Promise<{ count: number; items: BlogResponseDto[] }> {
    try {
      const { count, items } = await this.blogRepository.findAll(
        filter,
        options,
      );
      return {
        count,
        items: items.map((item) => new BlogResponseDto(item)),
      };
    } catch (error) {
      throw new Error(`Failed to find blogs: ${error.message}`);
    }
  }

  public async findOne(uuid: Uuid): Promise<BlogResponseDto> {
    try {
      const blog = await this.blogRepository.findOneByUuid(uuid);
      if (!blog) {
        throw new Error(`Blog with UUID ${uuid} not found`);
      }
      return new BlogResponseDto(blog);
    } catch (error) {
      throw new Error(
        `Failed to find blog with UUID ${uuid}: ${error.message}`,
      );
    }
  }

  public async update(
    uuid: Uuid,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    try {
      const existingBlog = await this.blogRepository.preload({
        id: uuid,
        ...updateBlogDto,
      });
      if (!existingBlog) {
        throw new Error(`Blog with UUID ${uuid} not found`);
      }
      const updatedBlog = await this.blogRepository.save(existingBlog);
      return new BlogResponseDto(updatedBlog);
    } catch (error) {
      throw new Error(
        `Failed to update blog with UUID ${uuid}: ${error.message}`,
      );
    }
  }

  public async remove(uuid: Uuid): Promise<boolean> {
    try {
      const isRemoved = await this.blogRepository.permanentlyRemove(uuid);
      if (!isRemoved) {
        throw new Error(`Blog with UUID ${uuid} could not be deleted`);
      }
      return isRemoved;
    } catch (error) {
      throw new Error(
        `Failed to delete blog with UUID ${uuid}: ${error.message}`,
      );
    }
  }
}
