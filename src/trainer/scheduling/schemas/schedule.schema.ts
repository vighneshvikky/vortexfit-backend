import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import { SessionType } from '../enums/scheduling.enum';

export type SchedulingRuleDocument = HydratedDocument<SchedulingRule>;

@Schema()
export class SchedulingRule {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Trainer', required: true })
  trainerId: Types.ObjectId;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop({ required: true })
  bufferTime: number;

  @Prop({ enum: SessionType, required: true })
  sessionType: SessionType;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Number], required: true })
  daysOfWeek: number[];

  @Prop({ required: true })
  slotDuration: number;

  @Prop()
  maxBookingsPerSlot?: number;

  @Prop({ default: false })
  isBooked: boolean;

  @Prop({ type: [String] })
  exceptionalDays: string[];
}

export const SchedulingRuleSchema =
  SchemaFactory.createForClass(SchedulingRule);
