import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtModule } from '@nestjs/jwt';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { SubscriptionService } from './service/subscription.service';
import { SubscriptionRepository } from './repository/subscription.repository';
import { SubscriptionController } from './controller/subscription.controller';
import { planModule } from 'src/plans/plan.module';
import { ISUBSCRIPTIONREPOSITORY } from './repository/interface/subscription.inteface.repository';
import { ISUBSCRIPTIONSERVICE } from './service/interface/ISubscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    JwtModule.register({}),
    planModule,
  ],
  providers: [
    {
      provide: ISUBSCRIPTIONSERVICE,
      useClass: SubscriptionService,
    },
    {
      provide: ISUBSCRIPTIONREPOSITORY,
      useClass: SubscriptionRepository,
    },
  ],
  controllers: [SubscriptionController],
  exports: [
    {
      provide: ISUBSCRIPTIONSERVICE,
      useClass: SubscriptionService,
    },
    MongooseModule
  ],
})
export class SubscriptionModule {}
