import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// ctrl + o --> go back to the last place before the jump (expl: after g + d)

async function bootstrap() {
  // need to do smth with cors later on
  const app = await NestFactory.create(AppModule, { cors: false });
  await app.listen(3001);
}
bootstrap();
