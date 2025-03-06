import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';
import { BlogCommentModule } from '../blog-comment/blog-comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    UsersModule,
    FilesModule,
    BlogCommentModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, UsersService],
  exports: [BlogService],
})
export class BlogModule {}
