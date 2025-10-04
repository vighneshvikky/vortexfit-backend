import { Controller, Get, Inject, Query } from '@nestjs/common';
import { TransactionFilterDto } from '../dtos/transaction.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';

import { ParseObjectIdPipe } from 'src/common/pipes/parseObjectId.pipes';
import { Types } from 'mongoose';
import {
  ITransactionService,
  ITRANSACTIONSERVICE,
} from '../service/inteface/ITransactionService.interface';

@Controller('transactions')
export class transactionController {
  constructor(
    @Inject(ITRANSACTIONSERVICE)
    private readonly _transactionSerivce: ITransactionService,
  ) {}

  @Get('user')
  getByUser(
    @Query() filters: TransactionFilterDto,
    @GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    console.log('userId', userId);
    return this._transactionSerivce.getUserTransactions(userId, filters);
  }

  @Get('earnings')
  getEarnings(
    @GetUser('role') role: string,
    @GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this._transactionSerivce.getEarnings(userId, role);
  }

  @Get('expenses')
  getExpenses(@GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId) {
    return this._transactionSerivce.getExpenses(userId);
  }
}
