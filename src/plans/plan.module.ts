import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schema/plan.schema';
import { JwtModule } from '@nestjs/jwt';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/implementation/plan.service';
import { PlanRepository } from './repository/implementation/plan.repository';
import { IPLANREPOSITORY } from './repository/interface/plan.repository.interface';
import { IPLANSERVICE } from './services/interface/plan.service.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    JwtModule.register({}),
  ],
  providers: [
    {
      provide: IPLANSERVICE,
      useClass: PlanService,
    },
    {
      provide: IPLANREPOSITORY,
      useClass: PlanRepository,
    },
  ],
  controllers: [PlanController],
  exports: [
    {
      provide: IPLANSERVICE,
      useClass: PlanService,
    },
    {
      provide: IPLANREPOSITORY,
      useClass: PlanRepository,
    },
    MongooseModule,
  ],
})
export class planModule {}
