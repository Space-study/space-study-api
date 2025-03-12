import { Injectable } from '@nestjs/common';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private blogCommentRepository: Repository<BlogComment>,
  ) {}

  async create(
    createBlogCommentDto: CreateBlogCommentDto,
  ): Promise<BlogComment> {
    const blogComment = this.blogCommentRepository.create(createBlogCommentDto);
    return await this.blogCommentRepository.save(blogComment);
  }

  async findAll(): Promise<any[]> {
    return await this.blogCommentRepository.find();
  }

  async findOne(id: number): Promise<any> {
    return await this.blogCommentRepository.findOne({
      where: { comment_id: id },
    });
  }

  async findByBlogId(blogId: number): Promise<BlogComment[]> {
    return await this.blogCommentRepository.find({
      where: { blog_id: blogId },
    });
  }

  async update(
    id: number,
    updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<BlogComment> {
    await this.blogCommentRepository.update(id, updateBlogCommentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.blogCommentRepository.delete(id);
  }
}
