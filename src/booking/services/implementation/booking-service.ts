import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import { IBookingService } from '../interface/booking-service.interface';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepostory: IBookingRepository,
  ) {}

  async create(data: Partial<Booking>): Promise<Booking> {
    // const booking = new this.bookingModel(data);
    // return booking.save();
    return this.bookingRepostory.create(data);
  }
  // delete(id: string): Promise<boolean> {
  //   return this.bookingRepostory.delete(id)
  // }

  // findById(id: string): Promise<Booking | null> {
  //   return this.bookingRepostory.findByUser(id)
  // }

  // findBySlot(trainerId: string, date: string, timeSlot: string): Promise<Booking | null> {

  // }

  // findByTrainer(trainerId: string, date?: string): Promise<Booking[]> {

  // }

  // findByUser(userId: string): Promise<Booking[]> {

  // }

  update(id: string, data: Partial<Booking>): Promise<Booking | null> {
    return this.bookingRepostory.update(id, data);
  }

  updateByOrderId(id: string, data: Partial<Booking>): Promise<Booking | null> {
    return this.bookingRepostory.updateByOrderId(id, data);
  }

  // async findById(id: string): Promise<Booking | null> {
  //   return this.bookingRepostory.findById(new Types.ObjectId(id)).exec();
  // }

  // async findByUser(userId: string): Promise<Booking[]> {
  //   return this.bookingRepostory
  //     .find({ userId: new Types.ObjectId(userId) })
  //     .exec();
  // }

  // async findByTrainer(trainerId: string, date?: string): Promise<Booking[]> {
  //   const query: any = { trainerId: new Types.ObjectId(trainerId) };
  //   if (date) query.date = date;
  //   return this.bookingRepostory.find(query).exec();
  // }

  // async findBySlot(
  //   trainerId: string,
  //   date: string,
  //   timeSlot: string,
  // ): Promise<Booking | null> {
  //   return this.bookingRepostory
  //     .findOne({
  //       trainerId: new Types.ObjectId(trainerId),
  //       date,
  //       timeSlot,
  //     })
  //     .exec();
  // }

  // async update(id: string, data: Partial<Booking>): Promise<Booking | null> {
  //   return this.bookingRepostory.findByIdAndUpdate(id, data, { new: true }).exec();
  // }

  // async delete(id: string): Promise<boolean> {
  //   const result = await this.bookingRepostory.findByIdAndDelete(id).exec();
  //   return !!result;
  // }
}
