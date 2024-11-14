import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AllConfigType } from './config/config.type';
import validationOptions from './utils/validation-options';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { LoggingInterceptor } from './config/infrastructure/logger/logger.interceptor';
import { HttpExceptionFilter } from './config/infrastructure/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

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
    .useGlobalInterceptors(new ResolvePromisesInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('Space Study API')
    .setDescription('@Copyright 2024 Space Study Development Team')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
