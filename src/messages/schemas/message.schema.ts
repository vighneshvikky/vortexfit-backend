// schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  participants: string[];

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
