import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/user/user.module';
import { OtpService } from './services/otp.service';
import { MailerModule } from 'src/common/utils/mailer/mailer.module';
import { OtpModule } from './modules/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './services/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TrainerService } from 'src/trainer/trainer.service';
import { HashingModule } from './modules/hashing.module';
import { TrainerModule } from 'src/trainer/trainer.module';
import { TempUserRepository } from './repository/temp-user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { TempUser, TempUserSchema } from './schema/temp-user.schema';

@Module({
  imports: [
    UsersModule,
    MailerModule,
    OtpModule,
    HashingModule,
    TrainerModule,
    MongooseModule.forFeature([{ name: TempUser.name, schema: TempUserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, JwtService, TrainerService, TempUserRepository],
  exports: [OtpService, JwtModule, TempUserRepository],
})
export class AuthModule {}
