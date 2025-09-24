import {
  Body,
  ConflictException,
  Controller,
  Inject,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppLoggerService } from 'src/common/logger/log.service';
import { ILogger } from 'src/common/logger/log.interface';
import {
  CreateOrderDto,
  VerifyPaymentDto,
  VerifySubscriptionPaymentDto,
} from '../dtos/payment.dto';
import {
  IRazorpayService,
  RAZORPAY_SERVICE,
} from '../services/interface/IRazorpay.service.interface';
import { PlanService } from 'src/plans/services/implementation/plan.service';
import { SubscriptionService } from 'src/subscription/service/subscription.service';
import {
  IPlanService,
  IPLANSERVICE,
} from 'src/plans/services/interface/plan.service.interface';
import {
  ISubscriptionService,
  ISUBSCRIPTIONSERVICE,
} from 'src/subscription/service/interface/ISubscription.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject(RAZORPAY_SERVICE)
    private readonly _razorpayService: IRazorpayService,
    @Inject(BOOKING_SERVICE) private readonly _bookingService: IBookingService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) readonly logger: ILogger,
    @Inject(IPLANSERVICE)
    private readonly _planService: IPlanService,
    @Inject(ISUBSCRIPTIONSERVICE)
    private readonly _subscriptionService: ISubscriptionService,
  ) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-order')
  async createOrder(@Body() body: CreateOrderDto) {
    this.logger.log(body);

    const { amount } = body;

    const order = await this._razorpayService.createOrder(amount);
    return { order };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('verify-payment')
  async verifyPayment(
    @GetUser('sub') userId: string,
    @Body() body: VerifyPaymentDto,
  ) {
    this.logger.log(body);
    const {
      trainerId,
      sessionType,
      date,
      timeSlot,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;
    const crypto = require('crypto');

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    const existingBooking = await this._bookingService.findOne(
      trainerId,
      date,
      timeSlot,
    );

    if (existingBooking) {
      throw new ConflictException(
        'Booking already exists for the given slot please select another slot.',
      );
    }
    if (expectedSignature === razorpay_signature) {
      const booking = await this._bookingService.create({
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

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      return { status: 'success', bookingId: booking._id };
    } else {
      return { status: 'failure' };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-subscription-order')
  async createSubscriptionOrder(
    @Body() body: { planId: string; userId: string },
  ) {
    console.log('body for creating sub', body);

    const { planId, userId } = body;

    const plan = await this._planService.getPlanById(planId);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

            const existingSubscription =
          await this._subscriptionService.findActiveByUserAndPlan(
            userId,
            planId,
          );
console.log('existingSubscription', existingSubscription)
        if (existingSubscription) {
          throw new ConflictException('User already subscribed to this plan');
        }

    const order = await this._razorpayService.createOrder(plan.price);
    return { order, plan };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('verify-subscription-payment')
  async verifySubscriptionPayment(
    @GetUser('sub') userId: string,
    @Body() body: VerifySubscriptionPaymentDto,
  ) {
  

    const {
      planId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const crypto = require('crypto');

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      try {
        const plan = await this._planService.getPlanById(planId);
        if (!plan) {
          throw new NotFoundException('Plan not found');
        }

        const subscription =
          await this._subscriptionService.subscribeUserToPlan(
            userId,
            planId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          );

        if (!subscription) {
          throw new NotFoundException('Failed to create subscription');
        }

        return {
          status: 'success',
          subscriptionId: subscription._id,
          message: 'Subscription activated successfully',
        };
      } catch (error) {
        this.logger.error('Error creating subscription:', error);
        throw new ConflictException('Failed to create subscription');
      }
    } else {
      return {
        status: 'failure',
        message: 'Payment verification failed',
      };
    }
  }
}
