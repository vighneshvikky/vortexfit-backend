import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TrainerModule } from 'src/trainer/trainer.module';
import { RedisModule } from 'src/redis/redis.module';
import { OtpModule } from './services/otp/otp.module';
import { AuthService } from './auth.service';
import { JwtTokenService } from './services/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/common/helpers/mailer/mailer.module';
import { IJwtTokenService } from './interfaces/ijwt-token-service.interface';
import { OTP_SERVICE } from './interfaces/otp-service.interface';
import { OtpService } from './services/otp/otp.service';
import { MAIL_SERVICE } from 'src/common/helpers/mailer/mail-service.interface';
import { MailService } from 'src/common/helpers/mailer/mailer.service';
import { AUTH_SERVICE } from './interfaces/auth-service.interface';
import { UserRoleServiceRegistry } from 'src/common/services/user-role-service.registry';
import { AUTH_SERVICE_REGISTRY } from './interfaces/auth-service-registry.interface';
import { PASSWORD_UTIL } from 'src/common/interface/IPasswordUtil.interface';
import { PasswordUtil } from 'src/common/helpers/password.util';

@Module({
  imports: [
    UserModule,
    TrainerModule,
    RedisModule,
    OtpModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService,
    },
    {
      provide: OTP_SERVICE,
      useClass: OtpService,
    },
    {
      provide: MAIL_SERVICE,
      useClass: MailService,
    },
    {
      provide: AUTH_SERVICE_REGISTRY,
      useClass: UserRoleServiceRegistry,
    },
    {
      provide: PASSWORD_UTIL,
      useClass: PasswordUtil,
    },
  ],
  exports: [IJwtTokenService, PASSWORD_UTIL],
})
export class AuthModule {}
