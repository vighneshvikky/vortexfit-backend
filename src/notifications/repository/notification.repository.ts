import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationStatus,
} from '../schema/notification.schema';
import { INotificationRepository } from './interface/INotification.repository.interface';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class NotificationRepository
  extends BaseRepository<NotificationDocument>
  implements INotificationRepository
{
  constructor(
    @InjectModel(Notification.name)
    private _notificationModel: Model<NotificationDocument>,
  ) {
    super(_notificationModel);
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

  async markAllAsRead(userId: Types.ObjectId): Promise<{ success: boolean }> {
    await this._notificationModel.updateMany(
      { userId, status: NotificationStatus.UNREAD },
      { $set: { status: NotificationStatus.READ } },
    );
    return { success: true };
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await this._notificationModel.findByIdAndDelete(id);
  }

  async getUnReadCount(userId: Types.ObjectId): Promise<{count: number}>{
     console.log('🔢 Getting unread count for user:', userId);
    
    const count = await this._notificationModel
      .countDocuments({ userId, status: 'unread' })
      .exec();
    
    console.log('📊 Unread count result:', count);
    
    return { count };
  }
}
