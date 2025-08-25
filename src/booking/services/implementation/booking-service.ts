import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import { IBookingService } from '../interface/booking-service.interface';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import { BookingStatus } from 'src/booking/enums/booking.enum';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepostory: IBookingRepository,
  ) {}

  async create(data: Partial<Booking>): Promise<Booking> {
    return this.bookingRepostory.create(data);
  }


  update(id: string, data: Partial<Booking>): Promise<Booking | null> {
    return this.bookingRepostory.update(id, data);
  }

  updateByOrderId(id: string, data: Partial<Booking>): Promise<Booking | null> {
    return this.bookingRepostory.updateByOrderId(id, data);
  }

  getBookings(trainerId: string): Promise<Booking[] | null>{
    return this.bookingRepostory.bookingOfTrainerId(trainerId);
  }

  changeStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    return this.bookingRepostory.changeStatus(id, status);
  }
}
