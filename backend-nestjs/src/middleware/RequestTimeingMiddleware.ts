import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class RequestTimeingMiddleware implements NestMiddleware {
  constructor(
    @InjectPinoLogger(RequestTimeingMiddleware.name)
    private readonly logger: PinoLogger,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const start = performance.now();
    this.logger.debug(
      `${'='.repeat(10)} RECEIVED "${request.method}" REQUEST FOR ${
        request.url
      }`,
    );

    response.on('finish', () => {
      const end = performance.now();
      this.logger.debug(
        `${'='.repeat(10)}  REQUEST HANDLED IN ${Math.round(end - start)}ms`,
      );
    });

    next();
  }
}
