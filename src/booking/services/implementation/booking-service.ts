import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import { IBookingService } from '../interface/booking-service.interface';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import { BookingStatus } from 'src/booking/enums/booking.enum';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private readonly _bookingRepository: IBookingRepository,
  ) {}

  async create(data: Partial<Booking>): Promise<Booking> {
    // const userBookingCount = this._
    // weekly two bookings
    
    return this._bookingRepository.create(data);
  }

  update(id: string, data: Partial<Booking>): Promise<Booking | null> {
    return this._bookingRepository.update(id, data);
  }

  updateByOrderId(id: string, data: Partial<Booking>): Promise<Booking | null> {
    return this._bookingRepository.updateByOrderId(id, data);
  }

  getBookings(trainerId: string): Promise<Booking[] | null> {
    return this._bookingRepository.bookingOfTrainerId(trainerId);
  }

  changeStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    return this._bookingRepository.changeStatus(id, status);
  }
}
