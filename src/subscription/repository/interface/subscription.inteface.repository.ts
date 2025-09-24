import { Subscription, SubscriptionDocument } from "src/subscription/schema/subscription.schema";

export const ISUBSCRIPTIONREPOSITORY = Symbol('ISUBSCRIPTIONREPOSITORY')

export interface ISubscriptionRepository {
  create(data: Partial<Subscription>): Promise<SubscriptionDocument>;
  findByUserId(userId: string): Promise<SubscriptionDocument[]>;
   findActiveByUserAndPlan(userId: string, planId: string): Promise<SubscriptionDocument | null>;
}