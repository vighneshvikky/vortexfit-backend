// import { Module } from '@nestjs/common';
// import { WinstonModule } from 'nest-winston';
// import * as winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

// @Module({
//   imports: [
//     WinstonModule.forRoot({
//       transports: [
//         new DailyRotateFile({
//           filename: 'logs/application-%DATE%.log',
//           datePattern: 'YYYY-MM-DD',
//           zippedArchive: true,
//           maxSize: '20m',
//           maxFiles: '14d',
//           level: 'error',
//           format: winston.format.combine(
//             winston.format.timestamp(),
//             winston.format.json(),
//           ),
//         }),
//       ],
//     }),
//     new winston.transports.File({
//       filename: 'logs/error.log',
//       level: 'error',
//     }),
//   ],
// })
// export class LoggerModule {
//   constructor() {}
// }


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



