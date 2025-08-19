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

@Module({
  imports: [
    BookingModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    JwtModule.register({}),
  ],
  controllers: [PaymentsController],
  providers: [
    RazorpayService,
    {
      provide: BOOKING_SERVICE,
      useClass: BookingService,
    },
    {
      provide: IBookingRepository,
      useClass: BookingRepository,
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService
    },
  ],
})
export class PaymentModule {}
