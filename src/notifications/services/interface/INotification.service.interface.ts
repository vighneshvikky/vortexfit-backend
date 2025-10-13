import { NotificationDto } from 'src/notifications/dtos/notification.dto';
import { NotificationType } from 'src/notifications/schema/notification.schema';

export const INOTIFICATIONSERVICE = Symbol('INOTIFICATIONSERVICE');

export interface INotificationService {
  createNotification(
    userId: string,
    type: NotificationType,
    message: string,
  ): Promise<NotificationDto>;

  getUserNotifications(userId: string): Promise<NotificationDto[]>;

  markAsRead(notificationId: string): Promise<NotificationDto | null>;

  deleteNotification(notificationId: string): Promise<void>;
}
