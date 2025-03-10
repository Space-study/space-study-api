import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog, BlogStatus } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { AdminUpdateBlogDto } from './dto/admin-update-blog';
import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private useService: UsersService
  ) { }

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const newBlog = await this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(newBlog);
  }

  async findAll(): Promise<any[]> {
    const blogs = await this.blogRepository.find();
    const blogsWithUserDetails = await Promise.all(
      blogs.map(async (blog) => {
        const user = await this.useService.findById(blog?.author_id);
        return {
          ...blog,
          firstname: user?.firstName,
          lastname: user?.lastName,
        };
      })
    );
    return blogsWithUserDetails;
  }

  async findOne(id: number): Promise<any> {
    const blog = await this.blogRepository.findOne({ where: { blog_id: id } });
    if (!blog) {
      return null;
    }
    const user = await this.useService.findById(blog?.author_id);
    return {
      ...blog,
      firstname: user?.firstName,
      lastname: user?.lastName,
    };
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const existingBlog = await this.blogRepository.findOne({
      where: { blog_id: id },
    });
    if (!existingBlog) {
      throw new Error(`Blog not found`);
    }
    const updatedBlog = this.blogRepository.merge(existingBlog, updateBlogDto);
    return await this.blogRepository.save(updatedBlog);
  }

  async adminUpdate(
    id: number,
    adminUpdateBlogDto: AdminUpdateBlogDto,
  ): Promise<Blog> {
    const existingBlog = await this.blogRepository.findOne({
      where: { blog_id: id },
    });
    if (!existingBlog) {
      throw new Error(`Blog not found`);
    }

    if (existingBlog.status === BlogStatus.NOT_ACCEPTED) {
      adminUpdateBlogDto.status = BlogStatus.ACCEPTED;
    } else {
      adminUpdateBlogDto.status = BlogStatus.NOT_ACCEPTED;
    }

    const updatedBlog = this.blogRepository.merge(
      existingBlog,
      adminUpdateBlogDto,
    );
    return await this.blogRepository.save(updatedBlog);
  }

  async remove(id: number): Promise<void> {
    const existingBlog = await this.blogRepository.findOne({
      where: { blog_id: id },
    });

    if (!existingBlog) {
      throw new Error(`Blog with ID ${id} not found`);
    }
    await this.blogRepository.remove(existingBlog);
  }
}
