import {
  Injectable,
  LoggerService as NestLoggerService,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ILogger, LogMessage } from './log.interface';




@Injectable()
export class AppLoggerService implements ILogger{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: NestLoggerService,
  ) {}

  private formatMessage(message: LogMessage): string {
    return typeof message === 'string'
      ? message
      : JSON.stringify(message, null, 2);
  }

  log(message: LogMessage, context?: string) {
    this.logger.log(this.formatMessage(message), context || AppLoggerService.name);
  }

  warn(message: LogMessage, context?: string) {
    this.logger.warn(this.formatMessage(message), context || AppLoggerService.name);
  }

  error(message: LogMessage, trace?: string, context?: string) {
    this.logger.error(this.formatMessage(message), trace, context || AppLoggerService.name);
  }
}
