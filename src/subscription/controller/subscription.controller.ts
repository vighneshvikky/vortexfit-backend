import { Controller, Get, Param, Inject } from '@nestjs/common';

import {
  ISubscriptionService,
  ISUBSCRIPTIONSERVICE,
} from '../service/interface/ISubscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    @Inject(ISUBSCRIPTIONSERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @Get('user/:userId')
  async getUserSubscriptions(@Param('userId') userId: string) {
    return this.subscriptionService.getUserSubscriptions(userId);
  }
}
