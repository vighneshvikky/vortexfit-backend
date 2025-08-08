import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
      disableErrorMessages: false,
    }),
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
