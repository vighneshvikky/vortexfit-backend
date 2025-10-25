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
import { Wallet, WalletDocument } from 'src/wallet/schema/wallet.schema';
import { IUserDashboardRepository } from './interface/IUserDashboard.repository.interface';

@Injectable()
export class UserDashboardRepository implements IUserDashboardRepository {
  constructor(
    @InjectModel(Booking.name)
    private readonly _bookingModel: Model<BookingDocument>,
    @InjectModel(Subscription.name)
    private readonly _subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Transaction.name)
    private readonly _transactionModel: Model<TransactionDocument>,
    @InjectModel(Wallet.name)
    private readonly _walletModel: Model<WalletDocument>,
  ) {}

  async getTotalBookingsCount(userId: Types.ObjectId): Promise<number> {
    return this._bookingModel.countDocuments({ userId: userId.toString() });
  }

  async getUpcomingBookingsCount(userId: Types.ObjectId): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    return this._bookingModel.countDocuments({
      userId: userId.toString(),
      date: { $gte: today },
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    });
  }

  async getCompletedBookingsCount(userId: Types.ObjectId): Promise<number> {
    return this._bookingModel.countDocuments({
      userId: userId.toString(),
      status: BookingStatus.COMPLETED,
    });
  }

  async getActiveSubscription(userId: Types.ObjectId) {
    return this._subscriptionModel
      .findOne({
        userId,
        endDate: { $gte: new Date() },
      })
      .populate('planId')
      .exec();
  }

  async getRecentBookings(userId: Types.ObjectId, limit: number = 5) {
    return this._bookingModel
      .find({ userId: userId.toString() })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('trainerId', 'name email')
      .exec();
  }

  async getRecentTransactions(userId: Types.ObjectId) {
    return this._transactionModel
      .find({ fromUser: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('toUser', 'name email')
      .exec();
  }

  async getWalletBalance(userId: Types.ObjectId) {
    return this._walletModel.findOne({ userId }).exec();
  }

  async getTotalSpent(userId: Types.ObjectId): Promise<number> {
    const result = await this._transactionModel.aggregate([
      { $match: { fromUser: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getAllTransactions(userId: Types.ObjectId) {
    return this._transactionModel.find({ fromUser: userId }).exec();
  }
}
