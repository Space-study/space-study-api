import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/modules/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: process.env.NODE_ENV === 'development', // Automatically runs migrations on app start, can be disabled in production
  logging: process.env.NODE_ENV === 'development',
});

// Create a provider for the DataSource
const DatabaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      try {
        await AppDataSource.initialize();
        Logger.log('Database connected successfully', 'Database');
        return AppDataSource;
      } catch (error) {
        Logger.error('Error connecting to the database:', error, 'Database');
        process.exit(1);
      }
    },
  },
];

export default DatabaseProviders;
