// dtos/create-message.dto.ts
import { IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  roomId: string;

  @IsDateString()
  timestamp: string;

  @IsString()
  messageType: string; 

  @IsBoolean()
  isRead: boolean;

  @IsBoolean()
  isDelivered: boolean;
}
