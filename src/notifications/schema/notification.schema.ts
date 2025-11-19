import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  BOOKING = 'booking',
  SUBSCRIPTION = 'subscription',
  WALLET = 'wallet',
  PAYMENT = 'payment',
  SYSTEM = 'system',
}

export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread',
}

@Schema({ timestamps: true })
export class Notification {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({
    type: String,
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
