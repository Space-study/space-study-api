import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';
import { SwaggerConfig } from './config/swagger.config';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter, HttpResponseInterceptor } from './common/http';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { initializeTransactionalContext } from 'typeorm-transactional';
export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.setGlobalPrefix(AppModule.apiPrefix).enableCors({
    origin: process.env.FRONT_END_HOST,
    credentials: true,
  });

  app
    .use(helmet())
    .use(compression())
    .use(cookieParser())
    .use(bodyParser.json({ limit: '50mb' }))
    .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    .useGlobalInterceptors(new HttpResponseInterceptor(AppModule.mode))
    .useGlobalFilters(new HttpExceptionFilter(AppModule.logger))
    .useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          const formatError = (error: ValidationError) => {
            if (error.children?.length) {
              return {
                field: error.property,
                errors: error.children.map(formatError),
              };
            }
            return {
              field: error.property,
              errors: Object.values(error.constraints ?? {}),
            };
          };
          return new BadRequestException(
            errors.map((error) => formatError(error)),
          );
        },
        stopAtFirstError: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

  SwaggerConfig(app, AppModule.apiVersion);

  await app.listen(AppModule.port);

  Logger.log(`Server started on port ${AppModule.port}`, 'Main');

  return app;
}
void bootstrap();
