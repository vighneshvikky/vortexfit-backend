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
import { WinstonModule } from 'nest-winston';
import { ScheduleModule } from './trainer/scheduling/scheduling.module';
import { PaymentModule } from './payments/payments.module';
import { BookingModule } from './booking/booking.module';
import { JwtMiddleware } from './common/middleware/jwt-auth.middleware';
import { ChatModule } from './common/chat/chat.module';
import { MessageModule } from './messages/message.module';
import { TrainerModule } from './trainer/trainer.module';

winston.addColors({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'blue',
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({all: true}),
            winston.format.timestamp(),
            winston.format.printf(
              ({ timestamp, level, message }) =>
                `${timestamp} ${level}: ${message}`,
            ),
          ),
        }),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
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
    MessageModule,
  
  ],
  controllers: [AppController, AwsS3Controller],
  providers: [AppService, AwsS3Service],
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
