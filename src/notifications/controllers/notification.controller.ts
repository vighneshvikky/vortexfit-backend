import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
} from '@nestjs/common';

import { NotificationType } from '../schema/notification.schema';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import {
  INotificationService,
  INOTIFICATIONSERVICE,
} from '../services/interface/INotification.service.interface';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(INOTIFICATIONSERVICE)
    private readonly _notificationService: INotificationService,
  ) {}

  @Post()
  async createNotification(
    @GetUser('sub') userId: string,
    @Body('type') type: NotificationType,
    @Body('message') message: string,
  ) {
    return this._notificationService.createNotification(userId, type, message);
  }

  @Get('')
  async getUserNotifications(@GetUser('sub') userId: string) {
    console.log('userId', userId)
    return this._notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this._notificationService.markAsRead(id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this._notificationService.deleteNotification(id);
  }
}
