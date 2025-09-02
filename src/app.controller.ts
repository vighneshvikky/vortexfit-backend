import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
