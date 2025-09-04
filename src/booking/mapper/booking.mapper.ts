import { Booking } from '../schemas/booking.schema';
import { BookingModel } from '../models/booking.model';

export class BookingMapper {
  static toDomain(bookingDoc: Booking): BookingModel | null {
    if (!bookingDoc) return null;

    const booking = new BookingModel(
      bookingDoc.userId.toString(),
      bookingDoc.trainerId.toString(),
      bookingDoc.date,
      bookingDoc.timeSlot,
      bookingDoc.status,
      bookingDoc.amount,
      bookingDoc.currency,
      bookingDoc.paymentId,
      bookingDoc.orderId,
      bookingDoc.sessionType,
      bookingDoc.paymentSignature,
    );

    booking.createdAt = bookingDoc.createdAt;
    booking.updatedAt = bookingDoc.updatedAt;

    return booking;
  }

  static toDto(domain: BookingModel) {
    return {
      id: domain._id,
      userId: domain.userId,
      trainerId: domain.trainerId,
      date: domain.date,
      timeSlot: domain.timeSlot,
      status: domain.status,
      amount: domain.amount,
      currency: domain.currency,
      paymentId: domain.paymentId,
      orderId: domain.orderId,
      sessionType: domain.sessionType,
      paymentSignature: domain.paymentSignature,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
