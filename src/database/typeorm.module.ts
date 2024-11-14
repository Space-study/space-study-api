import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import {
  addTransactionalDataSource,
  getTypeOrmModuleOptions,
} from './database.provider';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: getTypeOrmModuleOptions,
      dataSourceFactory: async (options) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([Blog]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
