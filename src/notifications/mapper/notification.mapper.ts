import {
  NotificationDocument,
} from '../schema/notification.schema';

export class NotificationMapper {
  static toDto(notification: NotificationDocument) {
    return {
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
      type: notification.type,
      message: notification.message,
      status: notification.status,
      timestamp: notification.timestamp,
    };
  }

static toDtoList(notifications: NotificationDocument[]) {
  return notifications.map(notification => this.toDto(notification));
}

}
