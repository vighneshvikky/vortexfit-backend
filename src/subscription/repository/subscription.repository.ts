import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from '../schema/subscription.schema';
import { ISubscriptionRepository } from './interface/subscription.inteface.repository';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @InjectModel(Subscription.name)
    private _subscriptionModel: Model<SubscriptionDocument>,
  ) {}
  async create(data: Partial<Subscription>): Promise<SubscriptionDocument> {
    const subscription = new this._subscriptionModel({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return subscription.save();
  }

  async findByUserId(userId: string): Promise<SubscriptionDocument[]> {
    return this._subscriptionModel.find({ userId }).populate('planId').exec();
  }

  async findActiveByUserAndPlan(
    userId: string,
    planId: string,
  ): Promise<SubscriptionDocument | null> {
    return this._subscriptionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        planId: new Types.ObjectId(planId),
        status: 'ACTIVE',
      })
      .exec();
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const now = new Date();
    const sub = await this._subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
      status: 'ACTIVE',
    });

    return !sub;
  }
}
