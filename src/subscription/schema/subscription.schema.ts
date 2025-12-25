import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;
@Schema({ timestamps: true })
export class Subscription {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  orderId?: string;

  @Prop()
  paymentId?: string;

  @Prop()
  paymentSignature?: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
