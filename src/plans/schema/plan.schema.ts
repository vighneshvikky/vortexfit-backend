import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PlanDocument = HydratedDocument<Plan>;

@Schema({_id: false})
export class PlanLimits {
 @Prop({ type: Number, required: true })
  oneOnOneSessions: number | 'unlimited';

 @Prop({ type: Number, required: true })
  aiQueries: number | 'unlimited';

  @Prop({ default: false })
  chatAccess: boolean;

  @Prop({ default: false })
  videoAccess: boolean;

  @Prop({ default: false })
  communityAccess: boolean;

  @Prop({ default: false })
  prioritySupport: boolean;
}

export const PlanLimitsSchema = SchemaFactory.createForClass(PlanLimits);

@Schema({
  timestamps: true,
  collection: 'subscription_plans',
})
export class Plan {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 500,
  })
  description: string;

  @Prop({
    required: true,
    min: 0,
    type: Number,
  })
  price: number;

  @Prop({
    required: true,
    enum: ['monthly', 'yearly'],
    default: 'monthly',
  })
  billingCycle: 'monthly' | 'yearly';

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, enum: ['user', 'trainer'] })
  role: 'user' | 'trainer';

  @Prop({
    type: [String],
    default: [],
  })
  features: string[];

 @Prop({ type: PlanLimitsSchema, _id: false, required: true })
limits: PlanLimits;


  

  @Prop({
    default: 0,
    min: 0,
  })
  sortOrder: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
