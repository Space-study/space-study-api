import { Module } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentController } from './blog-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogComment])],
  controllers: [BlogCommentController],
  providers: [BlogCommentService],
  exports: [BlogCommentService],
})
export class BlogCommentModule {}
