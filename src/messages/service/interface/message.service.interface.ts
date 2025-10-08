import { Types } from 'mongoose';
import { MessageResponseDto } from 'src/messages/dtos/send-message.dto';

export const MESSAGE_SERVICE = Symbol('MESSAGE_SERVICE');

export interface IMessageService {
  saveMessage(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    content: string,

  ): Promise<MessageResponseDto>;

  getHistory(
    roomId: string,
    skip?: number,
    limit?: number,
  ): Promise<MessageResponseDto[]>;

  getAllChatsByUserOrTrainer(userId: string, role: string): Promise<  {
      lastMessage: string;
      lastUpdated: Date;
      participantId: string;
      name: string;
      email: string;
      image?: string;
    }[]>;
}
