import { Booking } from '../schemas/booking.schema';
import { BookingModel, UserRef } from '../models/booking.model';
import { Types } from 'mongoose';

type PopulatedUser = { _id: Types.ObjectId; name: string; image: string };

function isPopulatedUser(user: unknown): user is PopulatedUser {
  return (
    typeof user === 'object' && user !== null && '_id' in user && 'name' in user
  );
}

export class BookingMapper {
  static toDomain(bookingDoc: Booking): BookingModel | null {
    if (!bookingDoc) return null;

    let user: Types.ObjectId | UserRef;

    if (isPopulatedUser(bookingDoc.userId)) {
      user = {
        _id: bookingDoc.userId._id.toString(),
        name: bookingDoc.userId.name,
        image: bookingDoc.userId.image,
      };
    } else {
      user = new Types.ObjectId(bookingDoc.userId as string);
    }

    return new BookingModel(
      bookingDoc._id,
      user,
      bookingDoc.trainerId,
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
    };
  }
}
