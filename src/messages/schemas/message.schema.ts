import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Message {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ type: [String], index: true, required: true })
  participants: string[];

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: null })
  readAt?: Date | null;

  @Prop({ type: Date, index: true })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
