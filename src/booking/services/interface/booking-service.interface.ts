import { BookingModel } from 'src/booking/models/booking.model';
import { Booking } from 'src/booking/schemas/booking.schema';

export const BOOKING_SERVICE = 'BOOKING_SERVICE';

export interface IBookingService {
  create(data: CreateBookingDto): Promise<BookingModel | null>;
  getBookings(trainerId: string, page: number, limit: number): Promise<{ bookings: BookingModel[]; totalRecords: number }>;
  update(
    id: string,
    data: Partial<CreateBookingDto>,
  ): Promise<BookingModel | null>;
  updateByOrderId(
    id: string,
    data: Partial<CreateBookingDto>,
  ): Promise<BookingModel | null>;
  changeStatus(id: string, status: string): Promise<BookingModel | null>;
  getFilteredBookings(
    trainerId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: BookingModel[]; totalRecords: number }>;

  changeStatus(id: string, status: BookingStatus): Promise<BookingModel | null>;
}

import { Types } from 'mongoose';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { BookingFilterDto } from 'src/booking/dtos/booking-dto.interface';

export interface CreateBookingDto {
  userId: string | Types.ObjectId;
  trainerId: string | Types.ObjectId;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  amount: number;
  currency?: string;
  paymentId?: string;
  orderId?: string;
  sessionType?: string;
  paymentSignature?: string;
}
