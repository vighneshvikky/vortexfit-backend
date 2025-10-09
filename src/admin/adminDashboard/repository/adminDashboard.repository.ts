import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/subscription/schema/subscription.schema';
import { Trainer, TraninerDocument } from 'src/trainer/schemas/trainer.schema';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/schema/transaction.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { IAdminDashboardRepository } from './inteface/IAdminDashboard.repository.interface';

@Injectable()
export class AdminDashboardRepository implements IAdminDashboardRepository {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
    @InjectModel(Trainer.name) private _trainerModel: Model<TraninerDocument>,
    @InjectModel(Booking.name) private _bookingModel: Model<BookingDocument>,
    @InjectModel(Subscription.name)
    private _subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Transaction.name)
    private _transactionModel: Model<TransactionDocument>,
  ) {}

  async countUsers(): Promise<number> {
    return this._userModel.countDocuments();
  }

  async countTrainers(): Promise<number> {
    return this._trainerModel.countDocuments();
  }

  async countBookings(): Promise<number> {
    return this._bookingModel.countDocuments();
  }

  async countSubscriptions(): Promise<number> {
    return this._subscriptionModel.countDocuments();
  }

  async getTotalRevenue(): Promise<number> {
    const adminId = process.env.ADMIN_ID;
    const result = await this._transactionModel.aggregate([
      {
        $match: { toUser: new Types.ObjectId(adminId) },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getMonthlyRevenue(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const adminId = process.env.ADMIN_ID;
    const result = await this._transactionModel.aggregate([
      {
        $match: {
          toUser: new Types.ObjectId(adminId),
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getRevenueBySource() {
    const adminId = process.env.ADMIN_ID;
    return this._transactionModel.aggregate([
      {
        $match: { toUser: new Types.ObjectId(adminId) },
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
          source: '$_id',
          total: 1,
          count: 1,
        },
      },
    ]);
  }

  async getMonthlyRevenueBreakdown() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const adminId = process.env.ADMIN_ID;
    return this._transactionModel.aggregate([
      {
        $match: {
          toUser: new Types.ObjectId(adminId),
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
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
          total: 1,
          count: 1,
        },
      },
    ]);
  }

  async getRevenueByPlan() {
    return this._subscriptionModel.aggregate([
      {
        $lookup: {
          from: 'subscription_plans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      {
        $unwind: '$plan',
      },
      {
        $group: {
          _id: '$plan.name',
          total: { $sum: '$price' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          planName: '$_id',
          total: 1,
          count: 1,
        },
      },
    ]);
  }

  async getBookingsByStatus() {
    return this._bookingModel.aggregate([
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

  async getTopTrainersByBookings(limit = 10) {
    return this._bookingModel.aggregate([
      {
        $group: {
          _id: '$trainerId',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'trainers',
          localField: '_id',
          foreignField: '_id',
          as: 'trainer',
        },
      },
      {
        $unwind: '$trainer',
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          trainerId: '$_id',
          trainerName: '$trainer.name',
          trainerEmail: '$trainer.email',
          bookingCount: 1,
          totalRevenue: 1,
        },
      },
    ]);
  }

  async getRecentBookings(limit = 10) {
    return this._bookingModel
      .find()
      .populate('userId', 'name email')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getSubscriptionsByPlan() {
    return this._subscriptionModel.aggregate([
      {
        $lookup: {
          from: 'subscription_plans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      {
        $unwind: '$plan',
      },
      {
        $group: {
          _id: '$plan.name',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          planName: '$_id',
          count: 1,
        },
      },
    ]);
  }

  async getSubscriptionsByStatus() {
    return this._subscriptionModel.aggregate([
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

  async getActiveVsExpiredSubscriptions() {
    const now = new Date();
    return this._subscriptionModel.aggregate([
      {
        $group: {
          _id: {
            $cond: {
              if: { $gte: ['$endDate', now] },
              then: 'Active',
              else: 'Expired',
            },
          },
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

  async getUsersByFitnessGoals() {
    return this._userModel.aggregate([
      {
        $unwind: '$fitnessGoals',
      },
      {
        $group: {
          _id: '$fitnessGoals',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          goal: '$_id',
          count: 1,
        },
      },
    ]);
  }

  async getUsersByFitnessLevel() {
    return this._userModel.aggregate([
      {
        $group: {
          _id: '$fitnessLevel',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          level: '$_id',
          count: 1,
        },
      },
    ]);
  }

  async getNewUsersThisMonth() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this._userModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
  }

  async getRecentTransactions(limit = 20) {
    return this._transactionModel
      .find()
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
