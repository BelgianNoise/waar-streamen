/* eslint-disable prettier/prettier */
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

        AUTH_STREAMZ_ID_TOKEN: `...${process.env.AUTH_STREAMZ_ID_TOKEN?.slice(-5)}`,
        AUTH_STREAMZ_AUTH_TOKEN: `...${process.env.AUTH_STREAMZ_AUTH_TOKEN?.slice(-5)}`,
        AUTH_STREAMZ_ACCESS_TOKEN: `...${process.env.AUTH_STREAMZ_ACCESS_TOKEN?.slice(-5)}`,
        AUTH_STREAMZ_REFRESH_TOKEN: `...${process.env.AUTH_STREAMZ_REFRESH_TOKEN?.slice(-5)}`,
        AUTH_STREAMZ_PROFILE: `...${process.env.AUTH_STREAMZ_PROFILE?.slice(-5)}`,

        AUTH_VTMGO_AUTH_ID: `...${process.env.AUTH_VTMGO_AUTH_ID?.slice(-5)}`,
      },
    };
  }
}
