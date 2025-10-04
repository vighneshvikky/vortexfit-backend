import { Module } from '@nestjs/common';
import { transactionController } from './controller/transaction.controller';
import { JwtModule } from '@nestjs/jwt';
import { TransactionService } from './service/transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionRepository } from './repository/transaction.repository';
import { ITRANSACTIONREPOSITORY } from './repository/interface/ITransaction.repository.interface';
import { ITRANSACTIONSERVICE } from './service/inteface/ITransactionService.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    {
      provide: ITRANSACTIONSERVICE,
      useClass: TransactionService,
    },
    {
      provide: ITRANSACTIONREPOSITORY,
      useClass: TransactionRepository,
    },
  ],
  controllers: [transactionController],
  exports: [
    {
      provide: ITRANSACTIONSERVICE,
      useClass: TransactionService,
    },
    {
      provide: ITRANSACTIONREPOSITORY,
      useClass: TransactionRepository,
    },
    MongooseModule,
  ],
})
export class TransactionModule {}
