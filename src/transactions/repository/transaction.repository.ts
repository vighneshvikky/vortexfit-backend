import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { TransactionFilterDto } from '../dtos/transaction.dto';
import { FilterQuery } from 'mongoose';
import { ITransactionRepository } from './interface/ITransaction.repository.interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly _transactionModel: Model<TransactionDocument>,
  ) {}

  async recordTransaction(data: Partial<Transaction>): Promise<Transaction> {
    if (!data.fromModel) {
      throw new Error('fromModel is required (User or Trainer)');
    }
    if (!data.toModel) {
      throw new Error('toModel is required (User or Trainer)');
    }

    const tx = new this._transactionModel(data);
    return tx.save();
  }

  async getUserTransactions(
    userId: Types.ObjectId,
    filters?: TransactionFilterDto,
    page: number = 1,
    limit: number = 4,
  ) {
    const query: FilterQuery<TransactionDocument> = {
      $or: [{ fromUser: userId }, { toUser: userId }],
    };

    if (filters?.sourceType) query.sourceType = filters.sourceType;

    if (filters?.fromDate || filters?.toDate) {
      query.createdAt = {};
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        query.createdAt.$gte = fromDate;
      }
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    const skip = (page - 1) * limit;

    return this._transactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .exec();
  }

  async getTrainerTransactions(trainerId: string) {
    return this._transactionModel
      .find({
        $or: [{ fromUser: trainerId }, { toUser: trainerId }],
        isCancelled: { $ne: true },
      })
      .sort({ createdAt: -1 });
  }

  async updateCancellation(transactionId: Types.ObjectId) {
    return this._transactionModel.findByIdAndUpdate(
      { _id: transactionId },
      { isCancelled: true },
    );
  }

  async sumDebits(userId: Types.ObjectId): Promise<number> {
    const result = await this._transactionModel.aggregate([
      { $match: { fromUser: userId, isCancelled: { $ne: true } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result[0]?.total || 0;
  }

  async getAdminTransactions(adminId: string) {
    return this._transactionModel
      .find({ toUser: adminId })
      .sort({ createdAt: -1 });
  }

  async getTransactionByPaymentId(paymentId: string) {
    return this._transactionModel.findOne({ paymentId }).exec();
  }

  async earnings(userId: Types.ObjectId): Promise<number>{
const result = await  this._transactionModel.aggregate([
  {$match: {toUser: userId, isCancelled: false}},
  {$group: {_id: null, totalEarnings: {$sum: "$amount"}}}
])

return result.length > 0 ? result[0].totalEarnings : 0;
  }

  async deleteTransaction(tId: string): Promise<{ deletedCount: number }> {
    const txId = new Types.ObjectId(tId);
    return this._transactionModel.deleteOne({ _id: txId });
  }

  async countUserTransactions(
    userId: Types.ObjectId,
    filters: TransactionFilterDto,
  ): Promise<number> {
    const query: FilterQuery<TransactionDocument> = {
      $or: [{ fromUser: userId }, { toUser: userId }],
    };

    if (filters?.sourceType) query.sourceType = filters.sourceType;
    if (filters?.fromDate || filters?.toDate) {
      query.createdAt = {};
      if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
      if (filters.toDate) query.createdAt.$lte = filters.toDate;
    }

    return this._transactionModel.countDocuments(query);
  }
}
