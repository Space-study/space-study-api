import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { getTypeOrmModuleOptions } from './database.provider';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: getTypeOrmModuleOptions,
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    TypeOrmModule.forFeature([BlogEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
