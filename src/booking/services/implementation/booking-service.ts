import { Inject, Injectable } from '@nestjs/common';
import { IBookingService } from '../interface/booking-service.interface';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { BookingMapper } from 'src/booking/mapper/booking.mapper';
import { BookingModel } from 'src/booking/models/booking.model';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private readonly _bookingRepository: IBookingRepository,
  ) {}


  async create(data: Partial<BookingModel>): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.create(data);
    return BookingMapper.toDomain(bookingDoc);
  }

  async update(id: string, data: Partial<BookingModel>): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.update(id, data);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async updateByOrderId(id: string, data: Partial<BookingModel>): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.updateByOrderId(id, data);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async getBookings(trainerId: string): Promise<BookingModel []| null> {
    const bookingDocs = await this._bookingRepository.bookingOfTrainerId(trainerId);
   return bookingDocs
  ? bookingDocs.map(b => BookingMapper.toDomain(b)!).filter(Boolean) as BookingModel[]
  : [];

  }

  async changeStatus(id: string, status: BookingStatus): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.changeStatus(id, status);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }
}
