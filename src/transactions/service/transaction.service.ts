import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../schema/transaction.schema';
import { TransactionFilterDto } from '../dtos/transaction.dto';
import { Types } from 'mongoose';
import {
  ITransactionRepository,
  ITRANSACTIONREPOSITORY,
} from '../repository/interface/ITransaction.repository.interface';
import { ITransactionService } from './inteface/ITransactionService.interface';
import {
  mapTransactionToDto,
  TransactionDto,
} from '../mapper/transaction.mapper';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @Inject(ITRANSACTIONREPOSITORY)
    private readonly _transactionRepository: ITransactionRepository,
  ) {}

  async recordTransaction(data: Partial<Transaction>): Promise<TransactionDto> {
    const savedTx = await this._transactionRepository.recordTransaction(data);
    return mapTransactionToDto(savedTx);
  }

  async getUserTransactions(
    userId: Types.ObjectId,
    filters?: TransactionFilterDto,
  ): Promise<TransactionDto[]> {
    const transactions = await this._transactionRepository.getUserTransactions(
      userId,
      filters,
    );
    return transactions.map(mapTransactionToDto);
  }

  async getTrainerTransactions(trainerId: string): Promise<TransactionDto[]> {
    const transactions =
      await this._transactionRepository.getTrainerTransactions(trainerId);
    return transactions.map(mapTransactionToDto);
  }

  async getAdminTransactions(adminId: string): Promise<TransactionDto[]> {
    const transactions =
      await this._transactionRepository.getAdminTransactions(adminId);
    return transactions.map(mapTransactionToDto);
  }

  // async getEarnings(userId: Types.ObjectId, role: string) {
  //   return this._transactionRepository.sumCredits(userId, role);
  // }

  async updateCancellation(
    transactionId: Types.ObjectId,
  ): Promise<TransactionDto> {
    const transactionData =
      await this._transactionRepository.updateCancellation(transactionId);
    if (!transactionData) {
      throw new NotFoundException('Transaction not found');
    }
    return mapTransactionToDto(transactionData);
  }

  async getTransactionByPaymentId(paymentId: string): Promise<TransactionDto> {
    const transactionData =
      await this._transactionRepository.getTransactionByPaymentId(paymentId);

    if (!transactionData) {
      throw new NotFoundException('Transaction not found');
    }

    return mapTransactionToDto(transactionData);
  }

  async getExpenses(userId: Types.ObjectId) {
    return this._transactionRepository.sumDebits(userId);
  }

  async deleteTransaction(tId: string){
    return this._transactionRepository.deleteTransaction(tId)
  }
}
