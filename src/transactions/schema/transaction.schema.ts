import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required : true })
  fromUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  toUser: Types.ObjectId;

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
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
