import { Module } from '@nestjs/common';
import { AiService } from './service/ai.serivce';
import { AiController } from './controller/ai.controller';
import { IAISERVICE } from './service/interface/ai.service.interface';

@Module({
  providers: [
    {
      useClass: AiService,
      provide: IAISERVICE,
    },
  ],
  controllers: [AiController],
  exports: [],
})
export class AiModule {}
