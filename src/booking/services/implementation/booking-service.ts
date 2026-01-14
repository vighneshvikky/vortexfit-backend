import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateBookingDto,
  IBookingService,
} from '@/booking/services/interface/booking-service.interface';
import { IBookingRepository } from '@/booking/repository/interface/booking-repository.interface';
import { BookingStatus } from '@/booking/enums/booking.enum';
import { BookingMapper } from '@/booking/mapper/booking.mapper';
import { BookingModel } from '@/booking/models/booking.model';
import { BookingFilterDto } from '@/booking/dtos/booking-dto.interface';
import { NotificationGateway } from '@/notifications/notification.gateway';
import { NotificationType } from '@/notifications/schema/notification.schema';
import {
  INotificationService,
  INOTIFICATIONSERVICE,
} from '@/notifications/services/interface/INotification.service.interface';
import { RAZORPAY_SERVICE } from '@/payments/services/interface/IRazorpay.service.interface';
import { RazorpayService } from '@/payments/services/implementation/razorpay.service';
import { Types } from 'mongoose';
import { IWALLETSERVICE } from '@/wallet/service/interface/IWalletService.interface';
import { WalletService } from '@/wallet/service/wallet.service';
import {
  ITransactionService,
  ITRANSACTIONSERVICE,
} from '@/transactions/service/inteface/ITransactionService.interface';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    private readonly _notificationGateway: NotificationGateway,
    @Inject(INOTIFICATIONSERVICE)
    private readonly _notificationService: INotificationService,
    @Inject(forwardRef(() => RAZORPAY_SERVICE))
    private readonly _razorpayService: RazorpayService,
    @Inject(IWALLETSERVICE) private readonly _walletService: WalletService,
    @Inject(ITRANSACTIONSERVICE)
    private readonly _transactionService: ITransactionService,
  ) {}

  async create(data: CreateBookingDto): Promise<BookingModel | null> {
    console.log('data for booking', data);
    const bookingDoc = await this._bookingRepository.create(data);

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

    return BookingMapper.toDomain(bookingDoc);
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
  ): Promise<{
    bookings: BookingModel[];
    totalRecords: number;
    currentPage: number;
    totalPages: number;
  }> {
    const result = await this._bookingRepository.bookingOfTrainerId(
      trainerId,
      page,
      limit,
    );
    const mappedBookings = result.bookings.map(
      (b) => BookingMapper.toDomain(b)!,
    );
    return {
      bookings: mappedBookings,
      totalRecords: result.totalRecords,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  async getUserBookings(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    bookings: BookingModel[];
    totalRecords: number;
    currentPage: number;
    totalPages: number;
  }> {
    const result = await this._bookingRepository.bookingOfUserId(
      userId,
      page,
      limit,
    );
    const mappedBookings = result.bookings.map(
      (b) => BookingMapper.toDomain(b)!,
    );
    return {
      bookings: mappedBookings,
      totalRecords: result.totalRecords,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  async getFilteredBookings(
    trainerId: string,
    filters: BookingFilterDto,
  ): Promise<{
    bookings: BookingModel[];
    totalRecords: number;
    currentPage: number;
    totalPages: number;
  }> {
    const result = await this._bookingRepository.getFilteredBookings(
      trainerId,
      filters,
    );
    if (!result)
      return { bookings: [], totalRecords: 0, currentPage: 0, totalPages: 0 };

    const { bookings } = result;

    const mappedBookings = bookings
      .map((b) => BookingMapper.toDomain(b)!)
      .filter(Boolean);

    return {
      bookings: mappedBookings,
      totalRecords: result.totalRecords,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  async getUserFilteredBookings(
    userId: string,
    filters: BookingFilterDto,
  ): Promise<{
    bookings: BookingModel[];
    totalRecords: number;
    currentPage: number;
    totalPages: number;
  }> {
    const result = await this._bookingRepository.getUserFilteredBookings(
      userId,
      filters,
    );
    if (!result)
      return { bookings: [], totalRecords: 0, currentPage: 0, totalPages: 0 };

    const { bookings } = result;

    const mappedBookings = bookings
      .map((b) => BookingMapper.toDomain(b)!)
      .filter(Boolean);

    return {
      bookings: mappedBookings,
      totalRecords: result.totalRecords,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  async changeStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.changeStatus(id, status);

    if (status === BookingStatus.CANCELLED) {
      const booking = await this._bookingRepository.findById(id);
      console.log('booking', booking);

      if (!booking) throw new NotFoundException('Booking not found');

      const slotDateTime = new Date(`${booking.date}T${booking.timeSlot}`);
      const now = new Date();
      const ONE_HOUR = 60 * 60 * 1000;
      if (slotDateTime.getTime() - now.getTime() < ONE_HOUR)
        throw new BadRequestException(
          'Cancellations are allowed only up to 1 hour before the session starts',
        );

      const refund = await this._razorpayService.refundPayment(
        booking.paymentId!,
        booking.amount,
      );

      booking.status = BookingStatus.CANCELLED;
      booking.refundId = refund.id;
      booking.refundStatus =
        refund.status === 'processed' ? 'processed' : 'pending';
      booking.refundAmount = refund.amount
        ? refund.amount / 100
        : booking.amount;
      booking.cancelledAt = new Date();

      // const updatedBooking = await this._bookingRepository.update(
      //   booking._id.toString(),
      //   booking,
      // );
      const userId = new Types.ObjectId(booking.userId);
      await this._walletService.handleFailedPayment(userId, {
        orderId: booking.orderId!,
        paymentId: booking.paymentId!,
        amount: booking.refundAmount * 100,
        reason: 'Booking cancellation refund',
      });

      const transaction =
        await this._transactionService.getTransactionByPaymentId(
          booking.paymentId!,
        );
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      await this._transactionService.deleteTransaction(transaction._id);

      const message = `Your booking on ${booking?.date} at ${booking?.timeSlot} has been cancelled. The amount has been credited to your wallet.`;

      const userNotification =
        await this._notificationService.createNotification(
          booking!.userId.toString(),
          NotificationType.BOOKING,
          message,
        );
      this._notificationGateway.sendNotification(
        booking.userId.toString(),
        userNotification,
      );
    }

    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async findOne(
    trainerId: string,
    date: string,
    timeSlot: string,
  ): Promise<BookingModel | null> {
    const bookingDoc = await this._bookingRepository.findOne({
      trainerId,
      date,
      timeSlot,
    });
    return bookingDoc ? BookingMapper.toDomain(bookingDoc) : null;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this._bookingRepository.findById(bookingId);
    const id = new Types.ObjectId(userId);

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.userId.toString() !== userId.toString())
      throw new ForbiddenException('You cannot cancel this booking');

    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Only pending bookings can be cancelled');

    const slotDateTime = new Date(`${booking.date}T${booking.timeSlot}`);
    const now = new Date();

    const ONE_HOUR = 60 * 60 * 1000;
    if (slotDateTime.getTime() - now.getTime() < ONE_HOUR)
      throw new BadRequestException(
        'Cancellations are allowed only up to 1 hour before the session starts',
      );

    console.log('Booking before refund:', booking);

    const refund = await this._razorpayService.refundPayment(
      booking.paymentId!,
      booking.amount,
    );

    console.log('refund', refund);

    booking.status = BookingStatus.CANCELLED;
    booking.refundId = refund.id;
    booking.refundStatus =
      refund.status === 'processed' ? 'processed' : 'pending';
    booking.refundAmount = refund.amount ? refund.amount / 100 : booking.amount;
    booking.cancelledAt = new Date();

    const updatedBooking = await this._bookingRepository.update(
      booking._id.toString(),
      booking,
    );

    if (!updatedBooking)
      throw new NotFoundException('Booking not found after update');

    const bookingDomain = BookingMapper.toDomain(updatedBooking)!;

    await this._walletService.handleFailedPayment(id, {
      orderId: booking.orderId!,
      paymentId: booking.paymentId!,
      amount: booking.refundAmount * 100,
      reason: 'Booking cancellation refund',
    });

    console.log('paymentId', booking.paymentId);

    const transaction =
      await this._transactionService.getTransactionByPaymentId(
        booking.paymentId!,
      );
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    console.log('transaction', transaction);

    console.log('trainerId', transaction._id);

    await this._transactionService.deleteTransaction(transaction._id);

    return {
      message: 'Booking cancelled and refund initiated',
      booking: bookingDomain,
    };
  }

  async lockSlot(
    trainerId: string,
    date: string,
    timeSlot: string,
    userId: string,
    amount: number,
    sessionType: string,
  ): Promise<BookingModel | null> {
    const existingLock = await this._bookingRepository.findOne({
      trainerId,
      date,
      timeSlot,
      sessionType,
      isLocked: true,
    });

    if (existingLock) {
      throw new BadRequestException(
        'Slot already locked or booked. Try another slot',
      );
    }

    const bookingData = await this._bookingRepository.create({
      trainerId,
      date,
      timeSlot,
      userId,
      isLocked: true,
      status: BookingStatus.PENDING,
      amount,
      sessionType,
    });

    return BookingMapper.toDomain(bookingData);
  }

  async unlockOrConfirmSlot(
    userId: string,
    trainerId: string,
    date: string,
    timeSlot: string,
    status: 'SUCCESS' | 'FAILED',
    paymentId: string,
  ): Promise<BookingModel | null> {
    if (status === 'SUCCESS') {
      const updatedBooking = await this._bookingRepository.unlockSlot(
        trainerId,
        date,
        timeSlot,
        paymentId,
      );
      const message = `Booking cofirmed on ${date} at ${timeSlot}`;
      console.log('userId for booking', userId);
      const userNotification =
        await this._notificationService.createNotification(
          userId,
          NotificationType.BOOKING,
          message,
        );

      const trainerNotification =
        await this._notificationService.createNotification(
          trainerId,
          NotificationType.BOOKING,
          message,
        );

      this._notificationGateway.sendNotification(userId, userNotification);

      this._notificationGateway.sendNotification(
        trainerId,
        trainerNotification,
      );

      return updatedBooking ? BookingMapper.toDomain(updatedBooking) : null;
    } else {
      await this._bookingRepository.deleteOne({
        trainerId,
        date,
        timeSlot,
        isLocked: true,
      });
      return null;
    }
  }
}
