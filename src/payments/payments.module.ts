import { forwardRef, Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { RazorpayService } from './services/implementation/razorpay.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/booking/schemas/booking.schema';
import { BookingModule } from 'src/booking/booking.module';
import { JwtModule } from '@nestjs/jwt';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { RAZORPAY_SERVICE } from './services/interface/IRazorpay.service.interface';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { planModule } from 'src/plans/plan.module';
import { TransactionModule } from 'src/transactions/transaction.module';

@Module({
  imports: [
    forwardRef(() => BookingModule),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    JwtModule.register({}),
    planModule,
    SubscriptionModule,
    TransactionModule,
  ],
  controllers: [PaymentsController],
  providers: [
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService,
    },
    {
      provide: RAZORPAY_SERVICE,
      useClass: RazorpayService,
    },
  ],
  exports: [RAZORPAY_SERVICE],
})
export class PaymentModule {}
