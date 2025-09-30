import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { TransactionFilterDto } from '../dtos/transaction.dto';

@Injectable()
export class TransactionRepository {
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
  ) {
    const query: any = { $or: [{ fromUser: userId }, { toUser: userId }] };

    if (filters?.sourceType) query.sourceType = filters.sourceType;
    if (filters?.fromDate || filters?.toDate) {
      query.createdAt = {};
      if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
      if (filters.toDate) query.createdAt.$lte = filters.toDate;
    }

    return this._transactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .exec();
  }

  async findByRole(
    role: string,
    userId?: string,
    filters?: TransactionFilterDto,
  ): Promise<Transaction[]> {
    const query: any = {};

    if (filters?.sourceType) query.sourceType = filters.sourceType;
    if (filters?.fromDate || filters?.toDate) {
      query.createdAt = {};
      if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
      if (filters.toDate) query.createdAt.$lte = filters.toDate;
    }

    return this._transactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .exec();
  }

  async getTrainerTransactions(trainerId: string) {
    return this._transactionModel
      .find({
        $or: [{ fromUser: trainerId }, { toUser: trainerId }],
      })
      .sort({ createdAt: -1 });
  }

  async sumCredits(userId: Types.ObjectId, role: string): Promise<number> {
    const match: any = {};
    if (role === 'trainer') {
      match.toUser = userId;
    } else if (role === 'admin') {
      // all earnings
    }

    const result = await this._transactionModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result[0]?.total || 0;
  }

  async sumDebits(userId: Types.ObjectId): Promise<number> {
    const result = await this._transactionModel.aggregate([
      { $match: { fromUser: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result[0]?.total || 0;
  }

  async getAdminTransactions(adminId: string) {
    return this._transactionModel
      .find({ toUser: adminId })
      .sort({ createdAt: -1 });
  }
}
