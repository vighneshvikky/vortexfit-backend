import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
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

  async createOrder(amount: number ) {
    const options = {
      amount: amount * 100,
      currency: 'INR',
    };

    return this.razorpay.orders.create(options)
  }


}
