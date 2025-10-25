import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schema/logger.schema';
import { loggerProvider } from './log.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [loggerProvider],
  exports: [loggerProvider],
})
export class LoggerConfigModule {}
