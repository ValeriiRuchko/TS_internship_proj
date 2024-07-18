import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// ctrl + o --> go back to the last place before the jump (expl: after g + d)

async function bootstrap() {
  // need to do smth with cors later on
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
    logger: ['warn', 'error', 'fatal', 'debug'],
  });

  app.useStaticAssets(join(process.cwd(), '/upload'), { prefix: '/upload' });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
