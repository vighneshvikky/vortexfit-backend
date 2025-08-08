import { Module } from '@nestjs/common';
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


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
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
    // AvailabilityModule
  ],
  controllers: [AppController, AwsS3Controller],
  providers: [AppService, AwsS3Service],
})
export class AppModule {}
