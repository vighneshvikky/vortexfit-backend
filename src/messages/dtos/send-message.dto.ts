import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class SendMessageDto {
  @IsString() receiverId!: string;
  @IsString() content!: string;
}

export class MessageResponseDto {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  messageType: string;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}
