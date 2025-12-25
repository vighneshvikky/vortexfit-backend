import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './common/helpers/mailer/mailer.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { AwsS3Controller } from './common/aws/controller/aws-s3.controller';
import { AwsS3Service } from './common/aws/services/aws-s3.service';
import * as winston from 'winston';
import { ScheduleModule } from './trainer/scheduling/scheduling.module';
import { PaymentModule } from './payments/payments.module';
import { BookingModule } from './booking/booking.module';
import { JwtMiddleware } from './common/middleware/jwt-auth.middleware';
import { ChatModule } from './common/chat/chat.module';
import { MessageModule } from './messages/message.module';
import { LoggerModule } from './common/logger/log.module';
import { VideoModule } from './common/video/video.module';
import { planModule } from './plans/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TransactionModule } from './transactions/transaction.module';
import { WalletModule } from './wallet/wallet.module';
import { NotificationModule } from './notifications/notification.module';
import { AiModule } from './ai/ai.module';
import { AdminDashboardModule } from './admin/adminDashboard/adminDashboard.module';
import { UserDashboardModule } from './user/userDashboard/userDashboard.module';
import { TrainerDashboardModule } from './trainer/trainerDashboard/trainerDashboard.module';
import { AWS_S3_SERVICE } from './common/aws/interface/aws-s3-service.interface';

winston.addColors({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'blue',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('Mongo URI:', uri);
        return { uri };
      },
      inject: [ConfigService],
    }),
    RedisModule,
    AuthModule,
    UserModule,
    MailModule,
    AdminModule,
    UploadModule,
    ScheduleModule,
    PaymentModule,
    BookingModule,
    ChatModule,
    VideoModule,
    MessageModule,
    LoggerModule,
    planModule,
    SubscriptionModule,
    TransactionModule,
    WalletModule,
    NotificationModule,
    AiModule,
    AdminDashboardModule,
    UserDashboardModule,
    TrainerDashboardModule,
  ],
  controllers: [AppController, AwsS3Controller],
  providers: [
    AppService,
    {
      useClass: AwsS3Service,
      provide: AWS_S3_SERVICE,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/signup', method: RequestMethod.POST },
        { path: 'auth/verify-otp', method: RequestMethod.POST },
        { path: 'auth/resend-otp', method: RequestMethod.POST },
        { path: 'auth/forgot-password', method: RequestMethod.POST },
        { path: 'auth/refresh/token', method: RequestMethod.POST },
        { path: 'auth/reset-password', method: RequestMethod.POST },
        { path: 'admin/login', method: RequestMethod.POST },
        { path: 'auth/google/*', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
