import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, receipt: string) {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: receipt,
    };

    return this.razorpay.orders.create(options)
  }
}
