import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TempUser extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: 'user' | 'trainer'

  @Prop({ default: Date.now, expires: 300 })
  createdAt: Date;
}

export const TempUserSchema = SchemaFactory.createForClass(TempUser);
