import { SubscriptionResponseDto } from '../dto/subscription.dto';
import { SubscriptionDocument } from '../schema/subscription.schema';

export class SubscriptionMapper {
  static toDto(subscription: SubscriptionDocument): SubscriptionResponseDto {
    return {
      _id: subscription._id.toString(),
      userId: subscription.userId.toString(),
      planId: subscription.planId.toString(),
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
      price: subscription.price,
      orderId: subscription.orderId,
      paymentId: subscription.paymentId,
    };
  }

  static toDtoList(
    subscriptions: SubscriptionDocument[],
  ): SubscriptionResponseDto[] {
    return subscriptions.map((sub) => this.toDto(sub));
  }
}
