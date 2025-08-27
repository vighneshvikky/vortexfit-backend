import { Booking } from 'src/booking/schemas/booking.schema';

export const BOOKING_SERVICE = 'BOOKING_SERVICE';

export interface IBookingService {
  create(data: Partial<Booking>): Promise<Booking>;
  getBookings(trainerId: string): Promise<Booking[] | null>;
  update(id: string, data: Partial<Booking>): Promise<Booking | null>;
  updateByOrderId(id: string, data: Partial<Booking>): Promise<Booking | null>;
  changeStatus(id: string, status: string): Promise<Booking | null>;
}
