import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema, Notification } from './schema/notification.schema';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationGateway } from './notification.gateway';
import { INOTFICATIONREPOSITORY } from './repository/interface/INotification.repository.interface';
import { INOTIFICATIONSERVICE } from './services/interface/INotification.service.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    {
      provide: INOTIFICATIONSERVICE,
      useClass: NotificationService,
    },
    {
      provide: INOTFICATIONREPOSITORY,
      useClass: NotificationRepository,
    },
    NotificationGateway,
  ],
  controllers: [NotificationController],
  exports: [
    NotificationGateway,
    {
      provide: INOTIFICATIONSERVICE,
      useClass: NotificationService,
    },
    {
      provide: INOTFICATIONREPOSITORY,
      useClass: NotificationRepository,
    },
  ],
})
export class NotificationModule {}
