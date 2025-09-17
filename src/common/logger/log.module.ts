import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigModule } from './log.config';

@Module({
  imports: [
    LoggerConfigModule,
    WinstonModule.forRootAsync({
      imports: [LoggerConfigModule],   
      inject: ['LOGGER_OPTIONS'],
      useFactory: (options) => options,
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}



