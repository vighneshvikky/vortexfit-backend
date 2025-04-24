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

@Module({
  imports: [
    UsersModule,
    MailerModule,
    OtpModule,
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
  providers: [AuthService, OtpService, JwtService],
  exports: [OtpService, JwtModule],
})
export class AuthModule {}
