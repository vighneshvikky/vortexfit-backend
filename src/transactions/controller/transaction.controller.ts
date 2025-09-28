import { Controller, Get, Query } from '@nestjs/common';
import { TransactionFilterDto } from '../dtos/transaction.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { TransactionService } from '../service/transaction.service';
import { ParseObjectIdPipe } from 'src/common/pipes/parseObjectId.pipes';
import { Types } from 'mongoose';

@Controller('transactions')
export class transactionController {
  constructor(private readonly _transactionSerivce: TransactionService) {}

  @Get('user')
  getByUser(
    @Query() filters: TransactionFilterDto,
    @GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
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
  getExpenses(@GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId){
    return this._transactionSerivce.getExpenses(userId)
  }
}
