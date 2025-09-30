import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';
import { Transaction } from '../schema/transaction.schema';
import { TransactionFilterDto } from '../dtos/transaction.dto';
import {Types} from 'mongoose'

@Injectable()
export class TransactionService {
  constructor(private readonly _transactionRepository: TransactionRepository) {}

  async recordTransaction(data: Partial<Transaction>): Promise<Transaction> {
    console.log('data', data);
    return await this._transactionRepository.recordTransaction(data);
  }

  async getUserTransactions(userId: Types.ObjectId, filters?: TransactionFilterDto) {
    return this._transactionRepository.getUserTransactions(userId, filters);
  }

  async getTrainerTransactions(trainerId: string) {
    return this._transactionRepository.getTrainerTransactions(trainerId);
  }

  async getAdminTransactions(adminId: string) {
    return this._transactionRepository.getAdminTransactions(adminId);
  }

   async getEarnings(userId: Types.ObjectId, role: string) {
    return this._transactionRepository.sumCredits(userId, role);
  }

    async getExpenses(userId: Types.ObjectId) {
    return this._transactionRepository.sumDebits(userId);
  }
}
