import { Booking } from '../schemas/booking.schema';
import { BookingDto } from '../dtos/booking-dto.interface';

export interface IBookingMapper {
  toDto(booking: Booking): BookingDto;
  toDtoArray(bookings: Booking[]): BookingDto[];
}
