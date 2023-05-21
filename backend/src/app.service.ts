import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  status(): Record<string, any> {
    return {
      _: 'Server is up and running!',
      'env-variables': {
        PORT: process.env.PORT,
        ENABLE_CACHE: process.env.ENABLE_CACHE,
        CACHE_RETENTION_MINUTES: process.env.CACHE_RETENTION_MINUTES,
        EXPOSE_OPENAPI: process.env.EXPOSE_OPENAPI,
      },
    };
  }
}
