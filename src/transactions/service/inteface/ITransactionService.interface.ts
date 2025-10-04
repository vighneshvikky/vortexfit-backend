import { Types } from 'mongoose';
import { TransactionFilterDto } from 'src/transactions/dtos/transaction.dto';
import { TransactionDto } from 'src/transactions/mapper/transaction.mapper';
import { Transaction } from 'src/transactions/schema/transaction.schema';

export const ITRANSACTIONSERVICE = Symbol('ITRANSACTIONSERVICE');

export interface ITransactionService {
  recordTransaction(data: Partial<Transaction>): Promise<TransactionDto>;
  getUserTransactions(
    userId: Types.ObjectId,
    filters?: TransactionFilterDto,
  ): Promise<TransactionDto[]>;
  getTrainerTransactions(trainerId: string): Promise<TransactionDto[]>;
  getAdminTransactions(adminId: string): Promise<TransactionDto[]>;
  getEarnings(userId: Types.ObjectId, role: string): Promise<number>;
  getExpenses(userId: Types.ObjectId): Promise<number>;
}
