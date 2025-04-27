// src/trainer/schemas/trainer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrainerDocument = Trainer & Document;

@Schema({ timestamps: true })
export class Trainer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: string;
  
  @Prop()
  refreshToken: string;

  @Prop()
  refreshTokenExpiresAt: Date;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({
    required: false,
    enum: [
      'Cardio',
      'Yoga',
      'Martial Arts',
      'Sports-Specific',
      'Strength',
      'Other',
    ],
  })
  specialization: string;

  @Prop({ required: false, min: 0, max: 50 })
  experience: number;

  @Prop({ required: false })
  bio: string;

  @Prop()
  certifications: {
    type: string;
    document: string;
    verified: boolean;
  }[];

  @Prop({ type: String })
  idProof: string;

  @Prop({ default: 'pending' })
  verificationStatus: 'pending' | 'approved' | 'rejected';

  @Prop()
  rejectionReason?: string;

  @Prop()
  isBlocked: boolean;
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);
