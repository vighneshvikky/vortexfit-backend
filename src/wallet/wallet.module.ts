import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import { WalletService } from './service/wallet.service';
import { WalletRepository } from './repository/wallet.repository';
import { WalletController } from './controller/wallet.controller';
import { TransactionModule } from 'src/transactions/transaction.module';
import { BookingModule } from 'src/booking/booking.module';
import { IWALLETSERVICE } from './service/interface/IWalletService.interface';
import { IWALLETREPOSITORY } from './repository/interface/IWalletRepository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    JwtModule.register({}),
    TransactionModule,
    BookingModule,
  ],
  providers: [
    {
      useClass: WalletService,
      provide: IWALLETSERVICE,
    },
    {
      useClass: WalletRepository,
      provide: IWALLETREPOSITORY,
    },
  ],
  controllers: [WalletController],
  exports: [MongooseModule],
})
export class WalletModule {}
