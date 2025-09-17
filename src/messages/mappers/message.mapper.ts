import { Injectable } from '@nestjs/common';
import { ChatMessage } from "../schemas/message.schema";
import { MessageResponseDto } from "../dtos/send-message.dto";

@Injectable()
export class MessageMapper {
  static toDomain(raw: ChatMessage): ChatMessage {
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

  
  toDto(entity: ChatMessage): MessageResponseDto {
    const dto = new MessageResponseDto();
    dto.id = entity['_id']?.toString();
    dto.content = entity.content;
    dto.senderId = entity.senderId;
    dto.receiverId = entity.receiverId;
    dto.roomId = entity.roomId;
    dto.messageType = entity.messageType;
    dto.isRead = entity.isRead;
    dto.isDelivered = entity.isDelivered;
    dto.createdAt = entity['createdAt'];
    dto.updatedAt = entity['updatedAt'];
    return dto;
  }

  toDtoList(entities: ChatMessage[]): MessageResponseDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
