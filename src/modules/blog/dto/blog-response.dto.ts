import { Blog } from '../entities/blog.entity';

export class BlogResponseDto {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(blog: Blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.content = blog.content;
    this.author = blog.author;
    this.createdAt = blog.baseEntity.createdAt;
    this.updatedAt = blog.baseEntity.updatedAt;
    this.deletedAt = blog.baseEntity.deletedAt;
  }
}
