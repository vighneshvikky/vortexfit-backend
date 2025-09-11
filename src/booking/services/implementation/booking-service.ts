import { Inject, Injectable } from '@nestjs/common';
import {
  CreateBookingDto,
  IBookingService,
} from '../interface/booking-service.interface';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { BookingMapper } from 'src/booking/mapper/booking.mapper';
import { BookingModel } from 'src/booking/models/booking.model';
import { BookingFilterDto } from 'src/booking/dtos/booking-dto.interface';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private readonly _bookingRepository: IBookingRepository,
  ) {}

  async create(data: CreateBookingDto): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.create(data);
    return BookingMapper.toDomain(bookingDoc);
  }

  async update(
    id: string,
    data: Partial<CreateBookingDto>,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.update(id, data);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async updateByOrderId(
    id: string,
    data: Partial<CreateBookingDto>,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.updateByOrderId(id, data);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

async getBookings(
  trainerId: string,
  page: number = 1,
  limit: number = 3
): Promise<{ bookings: BookingModel[]; totalRecords: number }> {
  const result = await this._bookingRepository.bookingOfTrainerId(trainerId, page, limit);
  const mappedBookings = result.bookings.map(b => BookingMapper.toDomain(b)!);
  return { bookings: mappedBookings, totalRecords: result.totalRecords };
}

async getFilteredBookings(
  trainerId: string,  
  filters: BookingFilterDto,
): Promise<{ bookings: BookingModel[]; totalRecords: number }> {
  const result = await this._bookingRepository.getFilteredBookings(trainerId, filters);
  if (!result) return { bookings: [], totalRecords: 0 };

  const { bookings, totalRecords } = result;

  const mappedBookings = bookings
    .map((b) => BookingMapper.toDomain(b)!)
    .filter(Boolean) as BookingModel[];

  return { bookings: mappedBookings, totalRecords };
}

  

  async changeStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.changeStatus(id, status);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }
}
