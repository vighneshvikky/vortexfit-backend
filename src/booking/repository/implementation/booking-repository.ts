import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import { IBookingRepository } from '../interface/booking-repository.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookingStatus } from 'src/booking/enums/booking.enum';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectModel(Booking.name)
    private readonly _bookingModel: Model<BookingDocument>,
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

  async bookingOfTrainerId(trainerId: string): Promise<Booking[] | null> {
    return this._bookingModel
      .find({ trainerId: trainerId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .exec();
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
