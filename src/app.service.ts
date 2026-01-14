import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ILogger } from './common/logger/log.interface';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: ILogger,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
