import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { SubscriptionService } from 'src/subscription/service/subscription.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.user?.sub || request.body.userId;
    console.log('userId from subscription guard', userId);
    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const subscriptions =
      await this.subscriptionService.getUserSubscriptions(userId);

    const active = subscriptions.find(
      (sub) => sub.status === 'active' && sub.endDate > new Date(),
    );

    if (!active) {
      throw new ForbiddenException('No active subscription found');
    }

    return true;
  }
}
