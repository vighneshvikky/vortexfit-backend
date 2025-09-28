import { Module } from '@nestjs/common';
import { transactionController } from './controller/transaction.controller';
import { JwtModule } from '@nestjs/jwt';
import { TransactionService } from './service/transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionRepository } from './repository/transaction.repository';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [TransactionService, TransactionRepository],
  controllers: [transactionController],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
