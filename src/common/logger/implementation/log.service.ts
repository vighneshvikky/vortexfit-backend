import { Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from '../interface/log.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = new Logger(LoggerService.name);

  log(message: string): void {
    this.logger.log(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }r

  error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }
}
