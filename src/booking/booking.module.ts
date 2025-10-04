import { Module } from '@nestjs/common';
import { BookingController } from './controller/booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { JwtModule } from '@nestjs/jwt';
import { BookingService } from './services/implementation/booking-service';
import { BOOKING_SERVICE } from './services/interface/booking-service.interface';
import { IBookingRepository } from './repository/interface/booking-repository.interface';
import { BookingRepository } from './repository/implementation/booking-repository';
import { UserModule } from 'src/user/user.module';
import { TrainerModule } from 'src/trainer/trainer.module';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    JwtModule.register({}),
    UserModule,
    TrainerModule,
    NotificationModule,
  ],
  providers: [
    BookingService,
    {
      provide: BOOKING_SERVICE,
      useClass: BookingService,
    },
    {
      provide: IBookingRepository,
      useClass: BookingRepository,
    },
  ],
  controllers: [BookingController],
  exports: [BOOKING_SERVICE, IBookingRepository, MongooseModule],
})
export class BookingModule {}
