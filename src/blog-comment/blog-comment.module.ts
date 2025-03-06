import { Module } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentController } from './blog-comment.controller';

@Module({
  controllers: [BlogCommentController],
  providers: [BlogCommentService],
})
export class BlogCommentModule {}
