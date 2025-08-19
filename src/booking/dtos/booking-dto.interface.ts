import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BookingStatus } from 'src/booking/enums/booking.enum';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  trainerId: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  timeSlot: string;
}

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}

export class BookingDto {
  id: string;
  userId: string;
  trainerId: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
