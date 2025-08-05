import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/scheduling.controller';
import { ScheduleService } from './services/implementation/scheduling.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEDULE_SERVICE } from './services/interface/scheduling.interface';
import {
  SchedulingRule,
  SchedulingRuleSchema,
} from './schemas/schedule.schema';
import { IScheduleRepository } from './repositories/interface/scheduling.repository.interface';
import { ScheduleRepository } from './repositories/implementation/scheduling.repository';
import { ITrainerRepository } from '../interfaces/trainer-repository.interface';
import { JwtModule } from '@nestjs/jwt';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SchedulingRule.name,
        schema: SchedulingRuleSchema,
      },
    ]),
    JwtModule.register({})
  ],
  controllers: [ScheduleController],
  providers: [
    
    {
      provide: SCHEDULE_SERVICE,
      useClass: ScheduleService,
    },
    {
      provide: IScheduleRepository,
      useClass: ScheduleRepository
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService
    }
  ],
  exports: [
    SCHEDULE_SERVICE,
  ],
})
export class ScheduleModule {}
