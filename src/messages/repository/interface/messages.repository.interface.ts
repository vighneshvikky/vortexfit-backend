import { Types } from 'mongoose';
import { ChatMessage } from '../../schemas/message.schema';

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');
export interface IMessageRepository {
  saveMessage(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    content: string,

  ): Promise<ChatMessage>;

  getHistory(
    roomId: string,
    skip?: number,
    limit?: number,
  ): Promise<ChatMessage[]>;

  getAllChatsByUserOrTrainer(userId: string, role: string): Promise<  {
      lastMessage: string;
      lastUpdated: Date;
      participantId: string;
      name: string;
      email: string;
      image?: string;
    }[]>;
}
