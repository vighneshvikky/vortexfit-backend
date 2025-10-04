import { Inject, Injectable } from '@nestjs/common';
import {
  CreateBookingDto,
  IBookingService,
} from '../interface/booking-service.interface';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { BookingMapper } from 'src/booking/mapper/booking.mapper';
import { BookingModel } from 'src/booking/models/booking.model';
import { BookingFilterDto } from 'src/booking/dtos/booking-dto.interface';
import { NotificationGateway } from 'src/notifications/notification.gateway';
import { NotificationType } from 'src/notifications/schema/notification.schema';
import {
  INotificationService,
  INOTIFICATIONSERVICE,
} from 'src/notifications/services/interface/INotification.service.interface';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    private readonly _notificationGateway: NotificationGateway,
    @Inject(INOTIFICATIONSERVICE)
    private readonly _notificationService: INotificationService,
  ) {}

  async create(data: CreateBookingDto): Promise<BookingModel | null> {
    console.log('data for booking', data);
    const bookingDoc = await this._bookingRepository.create(data);
    const booking = BookingMapper.toDomain(bookingDoc);

    const message = `Booking confirmed on ${data.date} at ${data.timeSlot}.`;

    const userNotification = await this._notificationService.createNotification(
      data.userId.toString(),
      NotificationType.BOOKING,
      message,
    );

    const trainerNotification =
      await this._notificationService.createNotification(
        data.trainerId.toString(),
        NotificationType.BOOKING,
        message,
      );

    this._notificationGateway.sendNotification(
      data.userId.toString(),
      userNotification,
    );

    this._notificationGateway.sendNotification(
      data.trainerId.toString(),
      trainerNotification,
    );

    return booking;
  }

  async update(
    id: string,
    data: Partial<CreateBookingDto>,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.update(id, data);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async updateByOrderId(
    id: string,
    data: Partial<CreateBookingDto>,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.updateByOrderId(id, data);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async getBookings(
    trainerId: string,
    page: number,
    limit: number,
  ): Promise<{ bookings: BookingModel[]; totalRecords: number }> {
    const result = await this._bookingRepository.bookingOfTrainerId(
      trainerId,
      page,
      limit,
    );
    const mappedBookings = result.bookings.map(
      (b) => BookingMapper.toDomain(b)!,
    );
    return { bookings: mappedBookings, totalRecords: result.totalRecords };
  }

  async getUserBookings(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ bookings: BookingModel[]; totalRecords: number }> {
    const result = await this._bookingRepository.bookingOfUserId(
      userId,
      page,
      limit,
    );
    const mappedBookings = result.bookings.map(
      (b) => BookingMapper.toDomain(b)!,
    );
    return { bookings: mappedBookings, totalRecords: result.totalRecords };
  }

  async getFilteredBookings(
    trainerId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: BookingModel[]; totalRecords: number }> {
    const result = await this._bookingRepository.getFilteredBookings(
      trainerId,
      filters,
    );
    if (!result) return { bookings: [], totalRecords: 0 };

    const { bookings, totalRecords } = result;

    const mappedBookings = bookings
      .map((b) => BookingMapper.toDomain(b)!)
      .filter(Boolean);

    return { bookings: mappedBookings, totalRecords };
  }

  async getUserFilteredBookings(
    userId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: BookingModel[]; totalRecords: number }> {
    const result = await this._bookingRepository.getUserFilteredBookings(
      userId,
      filters,
    );
    if (!result) return { bookings: [], totalRecords: 0 };

    const { bookings, totalRecords } = result;

    const mappedBookings = bookings
      .map((b) => BookingMapper.toDomain(b)!)
      .filter(Boolean);

    return { bookings: mappedBookings, totalRecords };
  }

  async changeStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingModel | null> {

    const bookingDoc = await this._bookingRepository.changeStatus(id, status);
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async findOne(
    trainerId: string,
    date: string,
    timeSlot: string,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.findOne(
      trainerId,
      date,
      timeSlot,
    );
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }
}
