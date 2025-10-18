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
  ): Promise<{ transactions: TransactionFilterDto[]; total: number; currentPage: number; totalPages: number }>;
  getTrainerTransactions(trainerId: string): Promise<TransactionDto[]>;
  getAdminTransactions(adminId: string): Promise<TransactionDto[]>;
  getExpenses(userId: Types.ObjectId): Promise<number>;
  updateCancellation(transactionId: Types.ObjectId): Promise<TransactionDto>;
   getTransactionByPaymentId(paymentId: string): Promise<TransactionDto>
    deleteTransaction(tId: string): Promise<{ deletedCount: number }>;
    earnings(userId: Types.ObjectId): Promise<number>
}
