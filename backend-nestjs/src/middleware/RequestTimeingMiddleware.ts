import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class RequestTimeingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestTimeingMiddleware.name);

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
