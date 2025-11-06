import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from '../schema/subscription.schema';
import { ISubscriptionRepository } from './interface/subscription.inteface.repository';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class SubscriptionRepository
  extends BaseRepository<SubscriptionDocument>
  implements ISubscriptionRepository
{
  constructor(
    @InjectModel(Subscription.name)
    private _subscriptionModel: Model<SubscriptionDocument>,
  ) {
    super(_subscriptionModel);
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
    const sub = await this._subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
      status: 'ACTIVE',
    });

    return !sub;
  }

  async create(data: Partial<Subscription>): Promise<SubscriptionDocument> {
    const subscription = new this._subscriptionModel({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return subscription.save();
  }
}
