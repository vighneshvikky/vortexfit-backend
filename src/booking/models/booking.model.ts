import { Types } from 'mongoose';
import { BookingStatus } from '../enums/booking.enum';

export class BookingModel {
  constructor(
    public readonly _id: Types.ObjectId,
    public readonly userId: Types.ObjectId | UserRef,
    public readonly trainerId: Types.ObjectId | UserRef | string,
    public readonly date: string,
    public readonly timeSlot: string,
    public readonly status: BookingStatus,
    public readonly amount: number,
    public readonly currency: string,
    public readonly paymentId?: string,
    public readonly orderId?: string,
    public readonly sessionType?: string,
    public readonly paymentSignature?: string,
    public readonly isLocked?: boolean,
  ) {}
}

export type UserRef = {
  _id: string;
  name: string;
  image: string;
};
