import { MessageResponseDto } from 'src/messages/dtos/send-message.dto';
import { ChatMessage } from '../../schemas/message.schema';

export const MESSAGE_SERVICE = Symbol('MESSAGE_SERVICE');

export interface IMessageService {
  // Save a message and return the stored entity
  saveMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<MessageResponseDto>;

  // Get chat history for a room
  getHistory(
    roomId: string,
    skip?: number,
    limit?: number,
  ): Promise<MessageResponseDto[]>;
}