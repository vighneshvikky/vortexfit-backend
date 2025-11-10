import { Types } from 'mongoose';
import {
  NotificationDocument,
  Notification,
} from '../../schema/notification.schema';

export const INOTFICATIONREPOSITORY = Symbol('INOTFICATIONREPOSITORY');

export interface INotificationRepository {
  create(data: Partial<Notification>): Promise<NotificationDocument>;
  findByUser(userId: Types.ObjectId): Promise<NotificationDocument[]>;
  markAsRead(id: Types.ObjectId): Promise<NotificationDocument | null>;
  delete(id: Types.ObjectId): Promise<void>;
  markAllAsRead(userId: Types.ObjectId): Promise<{success: boolean}>;
  getUnReadCount(userId: Types.ObjectId): Promise<number>;
}
