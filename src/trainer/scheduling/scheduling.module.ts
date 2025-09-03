import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/scheduling.controller';
import { ScheduleService } from './services/implementation/scheduling.service';
import { SCHEDULE_SERVICE } from './services/interface/scheduling.interface';
import { IScheduleRepository } from './repositories/interface/scheduling.repository.interface';
import { ScheduleRepository } from './repositories/implementation/scheduling.repository';
import { JwtModule } from '@nestjs/jwt';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import { BookingRepository } from 'src/booking/repository/implementation/booking-repository';
import { BookingModule } from 'src/booking/booking.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SchedulingRule,
  SchedulingRuleSchema,
} from './schemas/schedule.schema';

import { UserModule } from 'src/user/user.module';
import { TrainerModule } from '../trainer.module';

@Module({
  imports: [
    BookingModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: SchedulingRule.name, schema: SchedulingRuleSchema },
    ]),
    UserModule,
    TrainerModule,
    BookingModule,
  ],
  controllers: [ScheduleController],
  providers: [
    {
      provide: SCHEDULE_SERVICE,
      useClass: ScheduleService,
    },
    {
      provide: IScheduleRepository,
      useClass: ScheduleRepository,
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService,
    },
    {
      provide: IBookingRepository,
      useClass: BookingRepository,
    },
  ],
  exports: [SCHEDULE_SERVICE],
})
export class ScheduleModule {}
