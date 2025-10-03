import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export interface MinimalUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

@Schema({ timestamps: true })
export class Transaction {
  _id: Types.ObjectId;

  @Prop({ required: true, enum: ['User', 'Trainer'] })
  fromModel: string;

  @Prop({ type: Types.ObjectId, refPath: 'fromModel', required: true })
  fromUser: Types.ObjectId | MinimalUser;

  @Prop({ required: true, enum: ['User', 'Trainer'] })
  toModel: string;

  @Prop({ type: Types.ObjectId, refPath: 'toModel', required: true })
  toUser: Types.ObjectId | MinimalUser;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ['BOOKING', 'SUBSCRIPTION'], required: true })
  sourceType: 'BOOKING' | 'SUBSCRIPTION';

  @Prop({ type: Types.ObjectId })
  sourceId: Types.ObjectId;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop()
  paymentId?: string;

  @Prop()
  orderId?: string;

  @Prop()
  paymentSignature?: string;

  @Prop({ required: true })
  bookingMethod?: string;

  @Prop() 
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
