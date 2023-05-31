import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestTimeingMiddleware } from './middleware/RequestTimeingMiddleware';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'http';
import { v4 } from 'uuid';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        autoLogging: false,
        genReqId: (request: IncomingMessage) => {
          const requestIdHeader = request.headers['x-request-id'];
          let requestId: string;
          if (Array.isArray(requestIdHeader)) {
            requestId = requestIdHeader[0];
          } else if (requestIdHeader?.length) {
            requestId = requestIdHeader;
          } else {
            requestId = v4();
          }

          const correlationIdHeader = request.headers['x-correlation-id'];
          let correlationId: string;
          if (Array.isArray(correlationIdHeader)) {
            correlationId = correlationIdHeader[0];
          } else if (correlationIdHeader?.length) {
            correlationId = correlationIdHeader;
          } else {
            correlationId = v4();
          }

          return { requestId, correlationId };
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true,
            ignore: 'pid,hostname',
            messageFormat: `[{context}] {msg}`,
          },
        },
        serializers: {
          // This NEEDS to be named "req"
          req: (req) => ({
            requestId: req.id.requestId,
            correlationId: req.id.correlationId,
            url: req.url,
            method: req.method,
            host: req.headers.host,
          }),
        },
      },
    }),
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestTimeingMiddleware).forRoutes('/');
  }
}
