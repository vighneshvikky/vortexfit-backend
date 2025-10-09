import { Booking, BookingDocument } from '@/booking/schemas/booking.schema';
import { IBookingRepository } from '@/booking/repository/interface/booking-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BookingStatus } from '@/booking/enums/booking.enum';
import { BookingFilterDto } from '@/booking/dtos/booking-dto.interface';
import { User, UserDocument } from '@/user/schemas/user.schema';

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

  async findById(id: string) {
    const bookingId = new Types.ObjectId(id);

    return this._bookingModel.findById({ _id: bookingId }).exec();
  }

  async updateOne(
    filter: Partial<Booking>,
    data: Partial<Booking>,
  ): Promise<Booking | null> {
    return this._bookingModel
      .findOneAndUpdate(filter, data, { new: true })
      .exec();
  }

  async deleteOne(filter: Partial<Booking>): Promise<void> {
    await this._bookingModel.deleteOne(filter).exec();
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
      searchTerm,
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

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [{ status: regex }, { sessionType: regex }, { date: regex }];
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const bookings = await this._bookingModel
      .find(query)
      .populate('userId', 'name email image')
      .populate('trainerId', 'name image')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalRecords = await this._bookingModel.countDocuments(query);

    return { bookings, totalRecords };
  }

  async getUserFilteredBookings(
    userId: string,
    filters: BookingFilterDto,
  ): Promise<{ bookings: Booking[]; totalRecords: number }> {
    const {
      status,
      dateFrom,
      dateTo,
      page = 1,
      searchTerm,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const query: FilterQuery<BookingDocument> = {
      userId: userId,
    };

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [{ status: regex }, { sessionType: regex }, { date: regex }];
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const bookings = await this._bookingModel
      .find(query)
      .populate('trainerId', 'name email image')
      .populate('userId', 'name _id image')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalRecords = await this._bookingModel.countDocuments(query);

    return { bookings, totalRecords };
  }

  async findOne(filter: Partial<Booking>) {
    return this._bookingModel.findOne(filter);
  }

  async lockSlot(
    trainerId: string,
    date: string,
    timeSlot: string,
  ): Promise<boolean> {
    const session = await this._bookingModel.db.startSession();
    session.startTransaction();

    try {
      const existing = await this._bookingModel.findOne({
        trainerId,
        date,
        timeSlot,
        $or: [{ isLocked: true }, { status: { $ne: 'CANCELLED' } }],
      });

      if (existing) {
        await session.abortTransaction();
        session.endSession();
        return false;
      }

      await this._bookingModel.create(
        [
          {
            trainerId,
            date,
            timeSlot,
            isLocked: true,
            status: 'LOCKED',
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
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
      status: { $ne: 'cancelled' },
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
    const today = new Date().toISOString().split('T')[0];

    const query = {
      trainerId,
      date: { $gte: today },
    };
    const [bookings, totalRecords] = await Promise.all([
      this._bookingModel
        .find(query)
        .populate('userId', '_id name image')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._bookingModel.countDocuments({ trainerId }),
    ]);

    return { bookings, totalRecords };
  }

  async bookingOfUserId(
    userId: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<{ bookings: Booking[]; totalRecords: number }> {
    const skip = (page - 1) * limit;
    const today = new Date().toISOString().split('T')[0];
    const query = {
      userId,
      date: { $gte: today },
    };
    const [bookings, totalRecords] = await Promise.all([
      this._bookingModel
        .find(query)
        .populate('trainerId', '_id name image')
        .populate('userId', '_id name image')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._bookingModel.countDocuments({ userId }),
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

  async unlockSlot(
    trainerId: string,
    date: string,
    timeSlot: string,
    paymentId: string,
  ): Promise<Booking | null> {
    return this._bookingModel
      .findOneAndUpdate(
        { trainerId, date, timeSlot, isLocked: true },
        {
          $set: {
            isLocked: false,
            status: BookingStatus.PENDING,
            paymentId,
          },
          $unset: {
            lockExpiresAt: '',
          },
        },
        { new: true },
      )
      .exec();
  }
}
