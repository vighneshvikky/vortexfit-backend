import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  doSomething() {
    this.logger.log('Doing something...');
    this.logger.warn('Something might be wrong');
    this.logger.error('Something went wrong', 'error');
  }
}
