import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { RazorpayService } from './services/implementation/razorpay.service';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import { BookingService } from 'src/booking/services/implementation/booking-service';
import { BOOKING_SERVICE } from 'src/booking/services/interface/booking-service.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/booking/schemas/booking.schema';
import { BookingModule } from 'src/booking/booking.module';
import { BookingRepository } from 'src/booking/repository/implementation/booking-repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { RAZORPAY_SERVICE } from './services/interface/IRazorpay.service.interface';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { planModule } from 'src/plans/plan.module';

@Module({
  imports: [
    BookingModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    JwtModule.register({}),
    planModule,
    SubscriptionModule
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
})
export class PaymentModule {}
