import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../schema/notification.schema';
import { INotificationRepository } from './interface/INotification.repository.interface';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private _notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: Partial<Notification>): Promise<NotificationDocument> {
    const notification = new this._notificationModel(data);
    return notification.save();
  }

  async findByUser(userId: Types.ObjectId): Promise<NotificationDocument[]> {
    return this._notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: Types.ObjectId): Promise<NotificationDocument | null> {
    return this._notificationModel.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true },
    );
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await this._notificationModel.findByIdAndDelete(id);
  }
}
