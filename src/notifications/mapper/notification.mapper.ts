import { NotificationDocument, NotificationStatus, NotificationType } from '../schema/notification.schema';

export class NotificationMapper {
  static toDto(notification: NotificationDocument) {
    return {
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
      type: notification.type as NotificationType,
      message: notification.message,
      status: notification.status as NotificationStatus,
      timestamp: notification.timestamp,
    };
  }

  static toDtoList(notifications: NotificationDocument[]) {
    return notifications.map(this.toDto);
  }
}
