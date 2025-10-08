import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageDocument } from '../../schemas/message.schema';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IMessageRepository } from '../interface/messages.repository.interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly _messageModel: Model<ChatMessageDocument>,
  ) {}

  async saveMessage(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    content: string,
  ) {
    const roomId = [senderId.toString(), receiverId.toString()]
      .sort()
      .join('_');

    return this._messageModel.create({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      participants: [
        new Types.ObjectId(senderId),
        new Types.ObjectId(receiverId),
      ],
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

  async getAllChatsByUserOrTrainer(
    userId: string,
    role: 'user' | 'trainer',
  ): Promise<
    {
      lastMessage: string;
      lastUpdated: Date;
      participantId: string;
      name: string;
      email: string;
      image?: string;
    }[]
  > {
    const objectId = new Types.ObjectId(userId);
    const oppositeCollection = role === 'user' ? 'trainers' : 'users';
    const result = await this._messageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: objectId }, { receiverId: objectId }],
        },
      },
      {
        $addFields: {
          otherParticipant: {
            $cond: [
              { $eq: ['$senderId', objectId] },
              '$receiverId',
              '$senderId',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$otherParticipant',
          lastMessage: { $last: '$content' },
          lastUpdated: { $last: '$updatedAt' },
        },
      },
      {
        $lookup: {
          from: oppositeCollection,
          localField: '_id',
          foreignField: '_id',
          as: 'participantInfo',
        },
      },
      { $unwind: '$participantInfo' },
      {
        $project: {
          _id: 0,
          participantId: '$_id',
          name: '$participantInfo.name',
          email: '$participantInfo.email',
          image: '$participantInfo.image',
          lastMessage: 1,
          lastUpdated: 1,
        },
      },
      { $sort: { lastUpdated: -1 } },
    ]);

    return result;
  }
}
