import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

dotenv.config();

const allowedOrigins = [
    'http://localhost:4200',
    'http://vortex-fit.space',
    'https://vortex-fit.space',
    'http://www.vortex-fit.space',
    'https://www.vortex-fit.space',
];
if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map((url) =>
    url.trim(),
  );
  allowedOrigins.push(...envOrigins);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.use(cookieParser());

  app.enableCors({
    origin: [
     'https://vortex-fit.space',           // HTTPS (primary)
      'https://www.vortex-fit.space',       // HTTPS www
      'http://vortex-fit.space',            // HTTP (will redirect)
      'http://www.vortex-fit.space',        // HTTP www (will redirect)
      'http://localhost:4200',  
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  console.log('NestJS is running on http://localhost:3000', process.env.PORT);
}
bootstrap();
