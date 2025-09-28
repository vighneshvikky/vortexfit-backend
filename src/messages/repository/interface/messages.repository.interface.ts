import { ChatMessage } from '../../schemas/message.schema';

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');
export interface IMessageRepository {
  // Persist a message between two users and return the stored entity
  saveMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<ChatMessage>;

  // Fetch paginated history for a given room
  getHistory(
    roomId: string,
    skip?: number,
    limit?: number,
  ): Promise<ChatMessage[]>;
}
