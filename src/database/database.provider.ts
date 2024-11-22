import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'src/snake-naming.strategy';
import { DataSource } from 'typeorm';

export type DataSourceName = string | 'default';

export const getTypeOrmModuleOptions =
  async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/modules/**/entities/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/*{.ts,.js}'],
      synchronize: false,
      migrationsRun: process.env.NODE_ENV === 'development',
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
      logger: 'advanced-console',
    };
  };

export const dataSources = new Map<DataSourceName, DataSource>();

export default getTypeOrmModuleOptions;
