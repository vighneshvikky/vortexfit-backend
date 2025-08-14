import { Body, Controller, Post } from '@nestjs/common';
import { RazorpayService } from '../services/implementation/razorpay.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('create-order')
  async createOrder(@Body() body: any) {
    const { amount, bookingId } = body;
    const order = await this.razorpayService.createOrder(amount, bookingId);

    return { order };
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const crypto = require('crypto');

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return { status: 'success' };
    } else {
      return { status: 'failure' };
    }
  }
}
