import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  _id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Trainer' })
  receiverId: Types.ObjectId;

  @Prop({ required: true, type: [Types.ObjectId], ref: 'User' })
  participants: Types.ObjectId[];

  @Prop({ default: 'text' })
  messageType: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ required: true })
  roomId: string;

  @Prop({ default: false })
  isDelivered: boolean;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
