import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';
import { SwaggerConfig } from './config/swagger.config';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter, HttpResponseInterceptor } from './common/http';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  return AppModule.port;
}
bootstrap().then((port: number) => {
  Logger.log(`Server started on port ${port}`, 'Main');
});
