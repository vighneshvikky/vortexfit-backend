import { SubscriptionResponseDto } from 'src/subscription/dto/subscription.dto';

export const ISUBSCRIPTIONSERVICE = Symbol('ISUBSCRIPTIONSERVICE');

export interface ISubscriptionService {
  subscribeUserToPlan(
    userId: string,
    planId: string,
    razorpay_order_id?: string,
    razorpay_payment_id?: string,
    razorpay_signature?: string,
  ): Promise<SubscriptionResponseDto>;

  getUserSubscriptions(userId: string): Promise<SubscriptionResponseDto[]>;

  findActiveByUserAndPlan(
    userId: string,
    planId: string,
  ): Promise<SubscriptionResponseDto | null>;
}
