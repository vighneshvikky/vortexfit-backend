import { Controller, Post, Body, Get, Param, Inject } from '@nestjs/common';
import { SubscriptionService } from '../service/subscription.service';
import { ISubscriptionService, ISUBSCRIPTIONSERVICE } from '../service/interface/ISubscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(@Inject(ISUBSCRIPTIONSERVICE) private readonly subscriptionService: ISubscriptionService) {}

  @Post('createSubscription')
  async subscribeUser(@Body() body: { planId: string; userId: string }) {
    console.log('userId and planId', body.userId, body.planId);
    return this.subscriptionService.subscribeUserToPlan(
      body.userId,
      body.planId,
    );
  }

  @Get('user/:userId')
  async getUserSubscriptions(@Param('userId') userId: string) {
    return this.subscriptionService.getUserSubscriptions(userId);
  }
}
