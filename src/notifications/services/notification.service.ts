import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationType } from '../schema/notification.schema';
import { NotificationGateway } from '../notification.gateway';
import {
  INOTFICATIONREPOSITORY,
  INotificationRepository,
} from '../repository/interface/INotification.repository.interface';
import { INotificationService } from './interface/INotification.service.interface';
import { NotificationMapper } from '../mapper/notification.mapper';
import { NotificationDto } from '../dtos/notification.dto';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject(INOTFICATIONREPOSITORY)
    private readonly _notificationRepo: INotificationRepository,
    private readonly _gateway: NotificationGateway,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
  ): Promise<NotificationDto> {
    const notification = await this._notificationRepo.create({
      userId: new Types.ObjectId(userId),
      type,
      message,
    });

    this._gateway.sendNotification(
      userId,
      NotificationMapper.toDto(notification),
    );
    return NotificationMapper.toDto(notification);
  }

  async getUserNotifications(userId: string): Promise<NotificationDto[]> {
    const notifications = await this._notificationRepo.findByUser(
      new Types.ObjectId(userId),
    );
    return NotificationMapper.toDtoList(notifications);
  }

  async markAsRead(notificationId: string): Promise<NotificationDto | null> {
    const notification = await this._notificationRepo.markAsRead(
      new Types.ObjectId(notificationId),
    );
    return notification ? NotificationMapper.toDto(notification) : null;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    return this._notificationRepo.delete(new Types.ObjectId(notificationId));
  }
}
