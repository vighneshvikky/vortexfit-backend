import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

export class ChangeBookingStatusDto {
  @IsString()
  bookingId: string;

  @IsEnum(BookingStatus, {
    message: 'bookingStatus must be a valid enum value',
  })
  bookingStatus: BookingStatus;
}

export interface CreateBookingDto {
  // Your existing CreateBookingDto properties
}

export class BookingFilterDto {
  @IsOptional()
  @IsString()
  trainerId?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  searchTerm?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
