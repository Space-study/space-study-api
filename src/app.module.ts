import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import DatabaseProviders from './database/database.provider';
import { APILogger } from './config/morgan.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV ? '.env.' + process.env.NODE_ENV : '.env'}`,
      ignoreEnvFile: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    ...DatabaseProviders,
  ],
  exports: [...DatabaseProviders],
})
export class AppModule {
  static port: number;
  static apiPrefix: string;
  static mode: string;
  static apiVersion: string;
  static logger: LoggerService;
  constructor(
    private readonly configService: ConfigService,
    logger: LoggerService,
  ) {
    AppModule.port = this.configService.get('API_PORT');
    AppModule.apiPrefix = this.configService.get('API_PREFIX');
    AppModule.logger = logger;
    AppModule.mode = this.configService.get('APP_MODE');
    AppModule.apiVersion = this.configService.get('API_VERSION');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(APILogger).forRoutes('*');
  }
}
