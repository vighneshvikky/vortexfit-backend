import {
  NotificationStatus,
  NotificationType,
} from '../schema/notification.schema';

export interface NotificationDto {
  _id: string;
  userId: string;
  type: NotificationType;
  message: string;
  status: NotificationStatus;
  timestamp: Date;
}
