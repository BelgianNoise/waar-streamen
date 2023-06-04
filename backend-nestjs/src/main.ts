import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.EXPOSE_OPENAPI === 'true') {
    // initialize openapi/swagger
    const config = new DocumentBuilder()
      .setTitle('Waar Streamen')
      .setDescription('Where to stream what')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    // Host openapi on /api, /api-json and /api-yaml
    SwaggerModule.setup('api', app, document);
  }

  app.useLogger(app.get(Logger));
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
