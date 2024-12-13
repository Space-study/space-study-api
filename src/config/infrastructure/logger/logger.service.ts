import { ILogger } from './logger.interface';
import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements ILogger {
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
      transports: [new winston.transports.Console(), transportError, transportInfo],
    });
  }

  info(context: string, message: string): void {
    Logger.log(`${message}`, context);
  }

  log(context: string, message: string): void {
    this.logger.log({ level: 'info', context, message });
  }

  error(context: string, message: string, trace: string) {
    this.logger.error({ context, message, trace });
  }

  warn(context: string, message: string, trace: object) {
    this.logger.warn({ level: 'warn', context, message, trace });
  }

  debug(message: string) {
    this.logger.debug({ level: 'debug', message });
  }

  setGlobalParameters(message: string, traceid: object) {
    this.logger.log({ level: 'info', message, traceid });
  }
}
