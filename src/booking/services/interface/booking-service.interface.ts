import { Booking } from 'src/booking/schemas/booking.schema';

export const BOOKING_SERVICE = 'BOOKING_SERVICE';

export interface IBookingService {
  create(data: Partial<Booking>): Promise<Booking>;
  // findById(id: string): Promise<Booking | null>;
  // findByUser(userId: string): Promise<Booking[]>;
  // findByTrainer(trainerId: string, date?: string): Promise<Booking[]>;
  // findBySlot(trainerId: string, date: string, timeSlot: string): Promise<Booking | null>;
  update(id: string, data: Partial<Booking>): Promise<Booking | null>;
  // delete(id: string): Promise<boolean>;
  updateByOrderId(id: string, data: Partial<Booking>): Promise<Booking | null>;
}
