import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WalletRepository } from '../repository/wallet.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TransactionService } from 'src/transactions/service/transaction.service';
import { BookingService } from 'src/booking/services/implementation/booking-service';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import {
  BOOKING_SERVICE,
  IBookingService,
} from 'src/booking/services/interface/booking-service.interface';
import { ITransactionService, ITRANSACTIONSERVICE } from 'src/transactions/service/inteface/ITransactionService.interface';
import { WalletMapper } from '../mapper/wallet.mapper';
import { IWalletRepository, IWALLETREPOSITORY } from '../repository/interface/IWalletRepository.interface';

@Injectable()
export class WalletService {
  constructor(
    @Inject(IWALLETREPOSITORY)
    private readonly _walletRepository: IWalletRepository,
    @Inject(ITRANSACTIONSERVICE)
    private readonly _transactionService: ITransactionService,
    @Inject(BOOKING_SERVICE)
    private readonly _bookingService: IBookingService,
  ) {}

  async handleFailedPayment(
    userId: Types.ObjectId,
    body: {
      orderId: string;
      paymentId: string;
      amount: number;
      reason: string;
    },
  ) {
    let wallet = await this._walletRepository.findByUserId(userId);
    const amount = body.amount / 100;

    if (!wallet) {
      wallet = await this._walletRepository.createWallet(userId, amount);
    } else {
      wallet.balance += amount;
      await wallet.save();
    }

    return { success: true, wallet: WalletMapper.toResponse(wallet) };
  }

  async payWithWallet(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    amount: number,
    sessionType: string,
    date: string,
    timeSlot: string,
  ) {
    const wallet = await this._walletRepository.findByUserId(userId);
    if (!wallet || wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    wallet.balance -= amount;
    await wallet.save();

    const booking = await this._bookingService.create({
      userId,
      trainerId,
      date,
      timeSlot,
      amount,
      sessionType,
      status: BookingStatus.CONFIRMED,
      bookingMethod: 'Wallet',
    });

    if (!booking) throw new NotFoundException('Booking not created');

    await this._transactionService.recordTransaction({
      fromUser: userId,
      fromModel: 'User',
      toUser: trainerId,
      toModel: 'User',
      bookingMethod: 'Wallet',
      amount,
      sourceType: 'BOOKING',
      sourceId: booking._id,
      currency: 'INR',
    });

    return {
      success: true,
      bookingId: booking._id,
      wallet: WalletMapper.toResponse(wallet),
    };
  }

  async getBalance(userId: Types.ObjectId) {
    const wallet = await this._walletRepository.findByUserId(userId);
    return {
      balance: wallet ? wallet.balance : 0,
      wallet: wallet ? WalletMapper.toResponse(wallet) : null,
    };
  }
}
