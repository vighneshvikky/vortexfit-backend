import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  bookingId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  sessionType: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: {
      time: String,
      isBooked: Boolean,
      isAvailable: Boolean,
    },
    required: true,
  })
  timeSlot: {
    time: string;
    isBooked: boolean;
    isAvailable: boolean;
  };

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string; // 'INR'

  @Prop()
  razorpayOrderId?: string;

  @Prop()
  razorpayPaymentId?: string;

  @Prop()
  razorpaySignature?: string;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending',
  })
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
