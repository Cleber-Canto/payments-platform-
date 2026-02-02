/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo RESTful
  app.setGlobalPrefix('api');

  // Validação de entrada
  // eslint-disable-next-line prettier/prettier
  app.useGlobalPipes(new ValidationPipe({
    // eslint-disable-next-line prettier/prettier
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3008);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
