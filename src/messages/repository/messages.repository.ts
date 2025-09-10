// repository/message.repository.ts
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageDocument } from '../schemas/message.schema';
import { Model } from 'mongoose';
import { convoKey } from 'src/common/helpers/participants.util';
import { Injectable } from '@nestjs/common';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly messageModel: Model<ChatMessageDocument>,
  ) {}

// repository/message.repository.ts
async saveMessage(senderId: string, receiverId: string, content: string) {
   const roomId = [senderId, receiverId].sort().join('_'); 
  return this.messageModel.create({
    senderId,
    receiverId,
    content,
    roomId,
  });
}

async getHistory(roomId: string, skip = 0, limit = 50) {
  return this.messageModel
    .find({ roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Math.min(limit, 200))
    .lean();
}

}
