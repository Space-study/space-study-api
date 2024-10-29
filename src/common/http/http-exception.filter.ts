import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { ThrottlerException } from '@nestjs/throttler';
import { ErrorType } from '../enums/error-type.enum';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let errorType: ErrorType | any;
    let message: any;
    if (exception instanceof ThrottlerException) {
      status = exception.getStatus();
      message = 'Too Many Requests';
      errorType = 'TOO_MANY_REQUESTS';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as {
        errorType: ErrorType | any;
        message: any;
        args: any;
      };
      errorType = response.errorType;
      message =
        typeof response.message === 'string'
          ? response.message
          : response.message
            ? response.message[0]
            : 'Internal Server Error';
      this.logger.error(exception.message, exception.stack);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      errorType = 'UNEXPECTED_ERROR';
      const stack = exception.stack ? exception.stack : '';
      this.logger.error(exception, stack);
    }
    response.status(status).json({
      statusCode: status,
      errorType,
      message,
      timestamp: new Date().getTime(),
    });
  }
}
