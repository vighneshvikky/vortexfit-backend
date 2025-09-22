import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import {
  IRazorpayService,
  RazorpayOrder,
} from '../interface/IRazorpay.service.interface';

@Injectable()
export class RazorpayService implements IRazorpayService {
  private _razorpay: Razorpay;

  constructor() {
    this._razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number): Promise<RazorpayOrder> {
    const options = {
      amount: amount * 100,
      currency: 'INR',
    };

    return this._razorpay.orders.create(options) as unknown as RazorpayOrder;
  }
}
