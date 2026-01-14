// logger.providers.ts
import { Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Log, LogDocument } from './schema/logger.schema';
import { Model } from 'mongoose';
import * as winston from 'winston';
import { MongoWinstonTransport } from './mongo-winston.transport';

export const loggerProvider: Provider = {
  provide: 'LOGGER_OPTIONS',
  inject: [getModelToken(Log.name)],
  useFactory: (logModel: Model<LogDocument>) => ({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp(),
          winston.format.printf(
            ({
              timestamp,
              level,
              message,
            }: {
              timestamp: string;
              level: string;
              message: string;
            }) => `${timestamp} ${level}: ${message}`,
          ),
        ),
      }),
      new MongoWinstonTransport({ logModel, level: 'warn' }),
    ],
  }),
};
