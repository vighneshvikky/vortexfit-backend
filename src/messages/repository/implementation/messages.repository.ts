
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageDocument } from '../../schemas/message.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IMessageRepository } from '../interface/messages.repository.interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly _messageModel: Model<ChatMessageDocument>,
  ) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    const roomId = [senderId, receiverId].sort().join('_');
    return this._messageModel.create({
      senderId,
      receiverId,
      content,
      roomId,
    });
  }

  async getHistory(roomId: string, skip = 0, limit = 50) {
    return this._messageModel
      .find({ roomId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Math.min(limit, 200))
      .lean();
  }
}
