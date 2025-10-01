import {
  Body,
  ConflictException,
  Controller,
  Inject,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { GetUser } from 'src/common/decorator/get-user.decorator';

import { BookingStatus } from 'src/booking/enums/booking.enum';
import {
  BOOKING_SERVICE,
  IBookingService,
} from 'src/booking/services/interface/booking-service.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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
import {
  IPlanService,
  IPLANSERVICE,
} from 'src/plans/services/interface/plan.service.interface';
import {
  ISubscriptionService,
  ISUBSCRIPTIONSERVICE,
} from 'src/subscription/service/interface/ISubscription.service';
import * as crypto from 'crypto';

import {
  ITransactionService,
  ITRANSACTIONSERVICE,
} from 'src/transactions/service/inteface/ITransactionService.interface';

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
    @Inject(ITRANSACTIONSERVICE)
    private readonly _transactionService: ITransactionService,
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
    @GetUser('role') role: string,
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

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
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
        bookingMethod: 'Razorpay',
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      await this._transactionService.recordTransaction({
        fromUser: new Types.ObjectId(userId),
        fromModel: 'User',
        toUser: new Types.ObjectId(trainerId),
        toModel: 'Trainer',
        amount,
        sourceType: 'BOOKING',
        sourceId: booking._id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        paymentSignature: razorpay_signature,
        bookingMethod: 'Razorpay',
      });

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
      await this._subscriptionService.findActiveByUserAndPlan(userId, planId);
    console.log('existingSubscription', existingSubscription);
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
    @GetUser('role') role: string,
    @Body() body: VerifySubscriptionPaymentDto,
  ) {
    const {
      planId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
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
        console.log('sub', subscription);
        if (!subscription) {
          throw new NotFoundException('Failed to create subscription');
        }

        const adminId = process.env.ADMIN_ID;

        if (role === 'trainer') {
          console.log('role', role);
          await this._transactionService.recordTransaction({
            fromUser: new Types.ObjectId(userId),
            fromModel: 'Trainer',
            toUser: new Types.ObjectId(adminId),
            toModel: 'User',
            amount: plan.price,
            sourceType: 'SUBSCRIPTION',
            sourceId: new Types.ObjectId(subscription._id),
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            paymentSignature: razorpay_signature,
            bookingMethod: 'Razorpay',
          });
        } else {
          await this._transactionService.recordTransaction({
            fromUser: new Types.ObjectId(userId),
            fromModel: 'User',
            toUser: new Types.ObjectId(adminId),
            toModel: 'User',
            amount: plan.price,
            sourceType: 'SUBSCRIPTION',
            sourceId: new Types.ObjectId(subscription._id),
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            paymentSignature: razorpay_signature,
            bookingMethod: 'Razorpay',
          });
        }

        return {
          status: 'success',
          subscriptionId: subscription._id,
          message: 'Subscription activated successfully',
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error(
            'Error creating subscription:',
            error.message,
            error.stack,
          );
        } else {
          this.logger.error('Error creating subscription:', String(error));
        }

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
