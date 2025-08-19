import { Booking } from 'src/booking/schemas/booking.schema';

export const IBookingRepository = 'IBookingRepository';

export interface IBookingRepository {
  create(data: Partial<Booking>): Promise<Booking>;

  //   findByUser(userId: string): Promise<Booking[]>;

  //   findByTrainer(trainerId: string, date?: string): Promise<Booking[]>;

  //   findBySlot(
  //     trainerId: string,
  //     date: string,
  //     timeSlot: string,
  //   ): Promise<Booking | null>;

  update(id: string, data: Partial<Booking>): Promise<Booking | null>;

  //   delete(id: string): Promise<boolean>;

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
}
