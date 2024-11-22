import { Injectable, NestMiddleware } from '@nestjs/common';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

@Injectable()
export class APILogger implements NestMiddleware {
  private accessLogStream = fs.createWriteStream(
    path.join(process.cwd(), 'logs/access.log'),
    { flags: 'a' },
  );

  constructor() {
    morgan.token('message', (req, res) => res.locals.errorMessage || '');
  }

  private successResponseFormat =
    ':method :url :status :response-time ms :user-agent :date[web]';

  private errorResponseFormat =
    ':method :url :status :response-time ms :user-agent :date[web] - error-message: :message';

  private successHandler = morgan(this.successResponseFormat, {
    stream: this.accessLogStream,
    skip: (req, res) => res.statusCode >= 400,
  });

  private errorHandler = morgan(this.errorResponseFormat, {
    stream: this.accessLogStream,
    skip: (req, res) => res.statusCode < 400,
  });

  use(req: any, res: any, next: (err?: any) => void) {
    this.successHandler(req, res, (err) => {
      if (err) return next(err);
      this.errorHandler(req, res, next);
    });
  }
}
