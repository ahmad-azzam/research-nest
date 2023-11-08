import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3011',
    },
  });

  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('APP_PORT');

  await app.listen(PORT || 8000);
}
bootstrap();
