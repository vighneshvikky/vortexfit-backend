import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/subscription/schema/subscription.schema';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/schema/transaction.schema';
import { ITrainerDashboardRepository } from './interface/ITrainerDashboard.repository.interface';

@Injectable()
export class TrainerDashboardRepository implements ITrainerDashboardRepository {
  constructor(
    @InjectModel(Transaction.name)
    private _transactionModel: Model<TransactionDocument>,
    @InjectModel(Booking.name)
    private _bookingModel: Model<BookingDocument>,
    @InjectModel(Subscription.name)
    private _subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async getTotalBookings(trainerId: Types.ObjectId): Promise<number> {
    return this._bookingModel.countDocuments({
      trainerId: trainerId.toString(),
    });
  }

  async getTotalRevenue(trainerId: Types.ObjectId): Promise<number> {
    const result = await this._transactionModel.aggregate([
      {
        $match: {
          toUser: trainerId,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getActiveSubscriptions(trainerId: Types.ObjectId): Promise<number> {
    return this._subscriptionModel.countDocuments({
      userId: trainerId,
      endDate: { $gte: new Date() },
    });
  }

  async getPendingBookings(trainerId: Types.ObjectId): Promise<number> {
    return this._bookingModel.countDocuments({
      trainerId: trainerId.toString(),
      status: BookingStatus.PENDING,
    });
  }

  async getRevenueBreakdown(trainerId: Types.ObjectId) {
    return this._transactionModel.aggregate([
      {
        $match: {
          toUser: trainerId,
        },
      },
      {
        $group: {
          _id: '$sourceType',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          total: 1,
          count: 1,
        },
      },
    ]);
  }

  async getRecentBookings(trainerId: Types.ObjectId, limit: number = 5) {
    return this._bookingModel
      .find({ trainerId: trainerId.toString() })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getBookingStatusBreakdown(trainerId: Types.ObjectId) {
    return this._bookingModel.aggregate([
      {
        $match: {
          trainerId: trainerId.toString(),
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);
  }

  async getMonthlyRevenue(trainerId: Types.ObjectId) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return this._transactionModel.aggregate([
      {
        $match: {
          toUser: trainerId,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          revenue: 1,
        },
      },
    ]);
  }
}
