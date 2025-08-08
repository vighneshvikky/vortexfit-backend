import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AvailabilityTemplate extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Trainer', required: true, index: true })
  trainerId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0, max: 6, index: true })
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.

  @Prop({
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  startTime: string; // e.g., "09:00"

  @Prop({
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  endTime: string; // e.g., "17:00"

  @Prop({ type: Number, required: true, min: 15, max: 480 })
  sessionDuration: number;

  @Prop({ type: Number, default: 15, min: 0 })
  breakDuration: number;

  @Prop({ type: Number, min: 1 })
  maxSessionsPerDay?: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop() // createdAt and updatedAt are auto-managed by timestamps: true
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AvailabilityTemplateSchema =
  SchemaFactory.createForClass(AvailabilityTemplate);

// Indexes
AvailabilityTemplateSchema.index({
  trainerId: 1,
  dayOfWeek: 1,
  isActive: 1,
});
AvailabilityTemplateSchema.index({
  trainerId: 1,
  isActive: 1,
});
AvailabilityTemplateSchema.index(
  { trainerId: 1, dayOfWeek: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  },
);

// Pre-save hook
AvailabilityTemplateSchema.pre('save', function (next) {
  const startMinutes = timeStringToMinutes(this.startTime);
  const endMinutes = timeStringToMinutes(this.endTime);

  if (startMinutes >= endMinutes) {
    return next(new Error('Start time must be before end time'));
  }

  if (endMinutes - startMinutes < this.sessionDuration) {
    return next(new Error('Time range is too short for the session duration'));
  }

  next();
});

function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
