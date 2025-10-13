import { Body, Controller, Get, Inject, Post } from '@nestjs/common';

import { GetUser } from 'src/common/decorator/get-user.decorator';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes/parseObjectId.pipes';
import {
  IWalletService,
  IWALLETSERVICE,
} from '../service/interface/IWalletService.interface';

@Controller('wallet')
export class WalletController {
  constructor(
    @Inject(IWALLETSERVICE) private readonly _walletService: IWalletService,
  ) {}

  @Post('failed-payment')
  async handleFailedPayment(
    @GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body()
    body: {
      orderId: string;
      paymentId: string;
      amount: number;
      reason: string;
    },
  ) {
    return this._walletService.handleFailedPayment(userId, body);
  }

  @Get('balance')
  getBalance(@GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId) {
    return this._walletService.getBalance(userId);
  }

  @Post('pay')
  async payWithWallet(
    @GetUser('sub', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body()
    body: {
      trainerId: string;
      amount: number;
      sessionType: string;
      date: string;
      timeSlot: string;
    },
  ) {
    return this._walletService.payWithWallet(
      userId,
      new Types.ObjectId(body.trainerId),
      body.amount,
      body.sessionType,
      body.date,
      body.timeSlot,
    );
  }
}
