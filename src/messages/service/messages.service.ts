import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repository/messages.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    return await this.messageRepository.saveMessage(
      senderId,
      receiverId,
      content,
    );
  }

  async getHistory(
    userId: string,
    peerId: string,
    skip?: number,
    limit?: number,
  ) {
    return await this.messageRepository.History(userId, peerId, skip, limit);
  }
}
