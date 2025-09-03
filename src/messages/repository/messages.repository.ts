import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { Model } from 'mongoose';
import { convoKey } from 'src/common/helpers/participants.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly MessageModel: Model<MessageDocument>,
  ) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    const participants = convoKey(senderId, receiverId);
    return this.MessageModel.create({
      senderId,
      receiverId,
      content,
      participants,
    });
  }

  async History(userId: string, peerId: string, skip = 0, limit = 50) {
    const participants = convoKey(userId, peerId);
    return this.MessageModel.find({ participants })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 200))
      .lean();
  }
}
