import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { RazorpayService } from '../services/implementation/razorpay.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { BookingService } from 'src/booking/services/implementation/booking-service';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import {
  BOOKING_SERVICE,
  IBookingService,
} from 'src/booking/services/interface/booking-service.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly razorpayService: RazorpayService,
    @Inject(BOOKING_SERVICE) private readonly bookingService: IBookingService,
  ) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-order')
  async createOrder(@Body() body: any) {
    console.log('body for create-order', body);

    const { amount } = body;

    const order = await this.razorpayService.createOrder(amount);

    return { order };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('verify-payment')
  async verifyPayment(@GetUser('sub') userId: string, @Body() body: any) {
    console.log('body for verify-payment', body);
     const { trainerId, sessionType, date, timeSlot, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const crypto = require('crypto');

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
    const booking = await this.bookingService.create({
      userId,
      trainerId,
      date,
      timeSlot,
      amount,
      sessionType,
      status: BookingStatus.PENDING,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paymentSignature: razorpay_signature,
    });

      return { status: 'success', bookingId: booking._id };
    } else {
      return { status: 'failure' };
    }
  }
}
