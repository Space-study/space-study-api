import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';
import { LoggerService } from 'src/logger/logger.service';
import { TypeOrmConfigModule } from 'src/database/typeorm.module';

@Module({
  imports: [TypeOrmConfigModule],
  providers: [BlogService, LoggerService, BlogRepository],
  controllers: [BlogController],
  exports: [BlogService, BlogRepository],
})
export class BlogModule {}
