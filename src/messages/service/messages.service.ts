// services/message.service.ts
import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repository/messages.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    
    return this.messageRepository.saveMessage(senderId, receiverId, content);
  }

  async getHistory(roomId: string, skip?: number, limit?: number) {
    return this.messageRepository.getHistory(roomId, skip, limit);
  }
}
