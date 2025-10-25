import { BookingFilterDto } from 'src/booking/dtos/booking-dto.interface';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { Booking } from 'src/booking/schemas/booking.schema';

export const IBookingRepository = 'IBookingRepository';

export interface IBookingRepository {
  create(data: Partial<Booking>): Promise<Booking>;

  bookingOfTrainerId(
    trainerId: string,
    page: number,
    limit: number,
  ): Promise<{ bookings: Booking[]; totalRecords: number,currentPage: number, totalPages: number }>;

  bookingOfUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ bookings: Booking[]; totalRecords: number,currentPage: number, totalPages: number }>;

  update(id: string, data: Partial<Booking>): Promise<Booking | null>;

  countActiveBookings(
    trainerId: string,
    dateStr: string,
    slotStart: string,
    slotEnd: string,
  ): Promise<number>;

  findOne(filter: Partial<Booking>): Promise<Booking | null>;

  getFilteredBookings(
    trainerId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: Booking[]; totalRecords: number,currentPage: number, totalPages: number }>;

  getUserFilteredBookings(
    userId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: Booking[]; totalRecords: number,currentPage: number, totalPages: number}>;

  updateByOrderId(
    orderId: string,
    data: Partial<Booking | null>,
  ): Promise<Booking | null>;

  changeStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<Booking | null>;

  findById(id: string): Promise<Booking | null>;
  updateOne(
    filter: Partial<Booking>,
    data: Partial<Booking>,
  ): Promise<Booking | null>;
  deleteOne(filter: Partial<Booking>): Promise<void>;

     unlockSlot(
    trainerId: string,
    date: string,
    timeSlot: string,
    paymentId: string,
  ): Promise<Booking | null> 
}
