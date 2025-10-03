  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { HydratedDocument, Types } from 'mongoose';
  import { BookingStatus } from '../enums/booking.enum';

  export type BookingDocument = HydratedDocument<Booking>;

  @Schema({ timestamps: true })
  export class Booking {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId | string;

    @Prop({ type: Types.ObjectId, ref: 'Trainer', required: true })
    trainerId: Types.ObjectId | string;

    @Prop({ required: true })
    date: string;

    @Prop({ required: true })
    timeSlot: string;

    @Prop({
      type: String,
      enum: BookingStatus,
      default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'INR' })
    currency: string;

    @Prop()
    paymentId?: string;

    @Prop()
    orderId?: string;
    @Prop()
    sessionType?: string;
    @Prop()
    paymentSignature?: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
  }

  export const BookingSchema = SchemaFactory.createForClass(Booking);
