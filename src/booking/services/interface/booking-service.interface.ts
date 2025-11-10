import { BookingModel } from '@/booking/models/booking.model';
import { Types } from 'mongoose';
import { BookingStatus } from '@/booking/enums/booking.enum';
import { BookingFilterDto } from '@/booking/dtos/booking-dto.interface';

export const BOOKING_SERVICE = 'BOOKING_SERVICE';

export interface IBookingService {
  create(data: CreateBookingDto): Promise<BookingModel | null>;
  getBookings(
    trainerId: string,
    page: number,
    limit: number,

  ): Promise<{ bookings: BookingModel[]; totalRecords: number,currentPage: number, totalPages: number }>;

  getUserBookings(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ bookings: BookingModel[]; totalRecords: number,currentPage: number, totalPages: number }>;

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
  ): Promise<{ bookings: BookingModel[]; totalRecords: number,currentPage: number, totalPages: number }>;

  changeStatus(id: string, status: BookingStatus): Promise<BookingModel | null>;

  cancelBooking(bookingId: string, userId: string): Promise<{
    message: string;
    booking: BookingModel
  }>

  getUserFilteredBookings(
    userId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: BookingModel[]; totalRecords: number,currentPage: number, totalPages: number  }>;

  findOne(
    trainerId: string,
    date: string,
    timeSlot: string,
  ): Promise<BookingModel | null>;

    lockSlot(trainerId: string, date: string, timeSlot: string, userId: string, amount: number, sessionType: string): Promise<BookingModel | null>;
  unlockOrConfirmSlot(
    userId: string,
    trainerId: string,
    date: string,
    timeSlot: string,
    status: 'SUCCESS' | 'FAILED',
     paymentId: string,
  ):  Promise<BookingModel | null>;

   
}

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
  bookingMethod: string;
}
