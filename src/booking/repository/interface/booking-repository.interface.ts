import { BookingStatus } from 'src/booking/enums/booking.enum';
import { Booking } from 'src/booking/schemas/booking.schema';

export const IBookingRepository = 'IBookingRepository';

export interface IBookingRepository {
  create(data: Partial<Booking>): Promise<Booking>;

  bookingOfTrainerId(trainerId: string): Promise<Booking[] | null>;

  update(id: string, data: Partial<Booking>): Promise<Booking| null>;


  countActiveBookings(
    trainerId: string,
    dateStr: string,
    slotStart: string,
    slotEnd: string,
  ): Promise<number>;

  updateByOrderId(
    orderId: string,
    data: Partial<Booking | null>,
  ): Promise<Booking | null>;

  changeStatus(bookingId: string, status: BookingStatus): Promise<Booking | null>;
}
