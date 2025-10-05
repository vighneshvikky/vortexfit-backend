import { Types } from 'mongoose';
import { TransactionFilterDto } from 'src/transactions/dtos/transaction.dto';
import { Transaction } from 'src/transactions/schema/transaction.schema';

export const ITRANSACTIONREPOSITORY = Symbol('ITRANSACTIONREPOSITORY');

export interface ITransactionRepository {
  recordTransaction(data: Partial<Transaction>): Promise<Transaction>;
  getUserTransactions(
    userId: Types.ObjectId,
    filters?: TransactionFilterDto,
  ): Promise<Transaction[]>;
  getTrainerTransactions(trainerId: string): Promise<Transaction[]>;
  getAdminTransactions(adminId: string): Promise<Transaction[]>;
  // sumCredits(userId: Types.ObjectId, role: string): Promise<number>;
  sumDebits(userId: Types.ObjectId): Promise<number>;
  updateCancellation(transactionId: Types.ObjectId): Promise<Transaction | null>;
   getTransactionByPaymentId(paymentId: string): Promise<Transaction | null>;
   deleteTransaction(tId: string): Promise<{ deletedCount?: number}>;
}
