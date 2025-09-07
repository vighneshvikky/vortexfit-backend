import { BookingFilterDto } from 'src/booking/dtos/booking-dto.interface';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { Booking } from 'src/booking/schemas/booking.schema';

export const IBookingRepository = 'IBookingRepository';

export interface IBookingRepository {
  create(data: Partial<Booking>): Promise<Booking>;

  bookingOfTrainerId(trainerId: string, page: number, limit: number): Promise<{ bookings: Booking[]; totalRecords: number }>;

  update(id: string, data: Partial<Booking>): Promise<Booking | null>;

  countActiveBookings(
    trainerId: string,
    dateStr: string,
    slotStart: string,
    slotEnd: string,
  ): Promise<number>;

  
  getFilteredBookings(trainerId: string, filters: BookingFilterDto): Promise<{bookings: Booking[]; totalRecords: number}>;

  updateByOrderId(
    orderId: string,
    data: Partial<Booking | null>,
  ): Promise<Booking | null>;

  changeStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<Booking | null>;


}
