import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import { IBookingRepository } from '../interface/booking-repository.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { BookingStatus } from 'src/booking/enums/booking.enum';
import { BookingFilterDto } from 'src/booking/dtos/booking-dto.interface';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectModel(Booking.name)
    private readonly _bookingModel: Model<BookingDocument>,
    @InjectModel(User.name)
    private readonly _userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<Booking>): Promise<Booking> {
    const booking = new this._bookingModel(data);

    return booking.save();
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this._bookingModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async findBySlot(
    trainerId: string,
    date: string,
    timeSlot: string,
  ): Promise<Booking | null> {
    return this._bookingModel.findOne({
      trainerId: new Types.ObjectId(trainerId),
      date,
      timeSlot,
    });
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this._bookingModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async update(id: string, data: Partial<Booking>): Promise<Booking | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this._bookingModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async getFilteredBookings(
    trainerId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: Booking[]; totalRecords: number }> {
    const {
      clientId,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 5,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const query: FilterQuery<BookingDocument> = {
      trainerId: trainerId,
    };

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }

    if (clientId) {
      query.userId = clientId;
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const bookings = await this._bookingModel
      .find(query)
      .populate('userId', 'name email')
      .populate('trainerId', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalRecords = await this._bookingModel.countDocuments(query);

    return { bookings, totalRecords };
  }

  async countActiveBookings(
    trainerId: string,
    dateStr: string,
    slotStart: string,
    slotEnd: string,
  ): Promise<number> {
    return this._bookingModel.countDocuments({
      trainerId,
      date: dateStr,
      timeSlot: `${slotStart}-${slotEnd}`,
      status: { $ne: 'CANCELLED' },
    });
  }

  async updateByOrderId(
    orderId: string,
    data: Partial<Booking>,
  ): Promise<Booking | null> {
    return this._bookingModel
      .findOneAndUpdate({ orderId }, { $set: data }, { new: true })
      .exec();
  }

  async bookingOfTrainerId(
    trainerId: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<{ bookings: Booking[]; totalRecords: number }> {
    const skip = (page - 1) * limit;
    const [bookings, totalRecords] = await Promise.all([
      this._bookingModel
        .find({ trainerId })
        .populate('userId', '_id name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._bookingModel.countDocuments({ trainerId }),
    ]);

    return { bookings, totalRecords };
  }

  async changeStatus(
    bookingId: string,
    bookingStatus: BookingStatus,
  ): Promise<Booking | null> {
    return this._bookingModel
      .findByIdAndUpdate(bookingId, { status: bookingStatus }, { new: true })
      .exec();
  }
}
