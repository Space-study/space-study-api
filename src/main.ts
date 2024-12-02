import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { bold } from 'colorette';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AllConfigType } from './config/config.type';
import validationOptions from './utils/validation-options';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { LoggingInterceptor } from './config/infrastructure/logger/logger.interceptor';
import { HttpExceptionFilter } from './config/infrastructure/exceptions/http-exception.filter';
import {
  ExceptionHandlerInterceptor,
  MetricsInterceptor,
  TracingInterceptor,
  RequestTimeoutInterceptor,
} from './config/infrastructure/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  app.enableCors({
    origin: configService.getOrThrow('app.frontendDomain', { infer: true }),
    credentials: true,
  });

  app
    .use(helmet())
    .use(compression())
    .use(cookieParser())
    .enableShutdownHooks()
    .use(bodyParser.json({ limit: '50mb' }))
    .useGlobalPipes(new ValidationPipe(validationOptions))
    .useGlobalFilters(new HttpExceptionFilter(AppModule.logger))
    .useGlobalInterceptors(new LoggingInterceptor(AppModule.logger))
    .use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
    .enableVersioning({
      type: VersioningType.URI,
    })
    .setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
      exclude: ['/'],
    })
    .useGlobalInterceptors(
      new ResolvePromisesInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector)),
      new RequestTimeoutInterceptor(new Reflector(), AppModule.logger),
      new ExceptionHandlerInterceptor(),
      new TracingInterceptor(AppModule.logger),
      new MetricsInterceptor(),
    );

  const options = new DocumentBuilder()
    .setTitle('Space Study API')
    .setDescription('@Copyright 2024 Space Study Development Team')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }), () => {
    AppModule.logger.info(
      'Application',
      `Service listening at ${bold(configService.getOrThrow('app.port', { infer: true }))} on ${bold(
        configService.getOrThrow('app.nodeEnv', { infer: true })?.toUpperCase(),
      )}`,
    );
    if (!configService.getOrThrow('app.isProduction', { infer: true })) {
      const host = configService.getOrThrow('app.backendDomain', { infer: true });
      AppModule.logger.info('Swagger', `🟢 Swagger listening at ${bold(`${host}/docs`)} 🟢`);
    }
  });

  AppModule.logger.info(
    'Postgres',
    `🔵 Postgres listening at ${bold(configService.getOrThrow('database.port', { infer: true }))}`,
  );
  AppModule.logger.info(
    'PgAdmin',
    `🔶 PgAdmin listening at ${bold(configService.getOrThrow('database.pgAdminUrl', { infer: true }))}`,
  );
  AppModule.logger.info(
    'Zipkin',
    `⚪ Zipkin[${bold('Tracing')}] listening at ${bold(configService.getOrThrow('app.zipkinUrl', { infer: true }))}`,
  );
  AppModule.logger.info(
    'Promethues',
    `⚪ Promethues[${bold('Metrics')}] listening at ${bold(configService.getOrThrow('app.promethuesUrl', { infer: true }))}`,
  );
}
void bootstrap();
