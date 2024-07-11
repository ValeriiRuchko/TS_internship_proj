import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// ctrl + o --> go back to the last place before the jump (expl: after g + d)

async function bootstrap() {
  // need to do smth with cors later on
  const app = await NestFactory.create(AppModule, { cors: false });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
