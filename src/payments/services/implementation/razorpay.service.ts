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

    return await this._razorpay.orders.create(options) as unknown as RazorpayOrder;
  }

  async refundPayment(paymentId: string, amount: number)
{
const refund = await this._razorpay.payments.refund(paymentId, {
  amount: amount * 100,
  speed: 'optimum'
});

return {
   id: refund.id,
    entity: 'refund',
    amount: refund.amount ?? amount * 100,
    currency: refund.currency,
    payment_id: refund.payment_id,
    status: refund.status as 'created' | 'processed' | 'failed',
    created_at: refund.created_at,
}
}
}
