import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as logger from 'morgan';
import { ValidationPipe } from '@nestjs/common';
const PORT = process.env.PORT || 1337;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger('tiny'));
  app.enableCors({ origin: 'https://alphaiota.io' });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
