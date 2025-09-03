import { Booking } from '../../schemas/booking.schema';
import { BookingDto } from 'src/booking/dtos/booking-dto.interface';

export class BookingMapper {
  static toDto(booking: Booking): BookingDto {
    return {
      id: booking._id.toString(),
      userId: booking.userId.toString(),
      trainerId: booking.trainerId.toString(),
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  static toDtoArray(bookings: Booking[]): BookingDto[] {
    return bookings.map((b) => this.toDto(b));
  }
}
