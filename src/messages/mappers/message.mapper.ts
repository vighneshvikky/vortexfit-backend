import { ChatMessage } from "../schemas/message.schema";

export class MessageMapper {
  static toDomain(raw: any): ChatMessage {
    return {
      content: raw.content,
      senderId: raw.senderId,
      receiverId: raw.receiverId,
      participants: raw.participants,
      messageType: raw.messageType,
      isRead: raw.isRead,
      isDelivered: raw.isDelivered,
    } as ChatMessage;
  }

  static toPersistence(message: Partial<ChatMessage>) {
    return {
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      participants: message.participants,
      messageType: message.messageType ?? 'text',
      isRead: message.isRead ?? false,
      isDelivered: message.isDelivered ?? false,
    };
  }
}
