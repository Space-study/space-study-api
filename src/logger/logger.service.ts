import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const config = {
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss S',
        }),
        winston.format.json(),
      ),
    };
    const transportError = new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      ...config,
    });
    const transportInfo = new winston.transports.DailyRotateFile({
      filename: 'logs/info-%DATE%.log',
      ...config,
    });
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        transportError,
        transportInfo,
      ],
    });
  }

  log(message: string) {
    this.logger.log({ level: 'info', message });
  }

  error(message: string, trace: string) {
    this.logger.error({ message, trace });
  }

  warn(message: string) {
    this.logger.warn({ level: 'warn', message });
  }

  debug(message: string) {
    this.logger.debug({ level: 'debug', message });
  }
}
