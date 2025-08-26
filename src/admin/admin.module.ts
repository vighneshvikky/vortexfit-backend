import { Module } from '@nestjs/common';
import { AdminController } from '../admin/controllers/admin.controller';
import { AdminService } from './services/implementation/admin.service';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { TrainerModule } from '../trainer/trainer.module';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { ADMIN_SERVICE } from '../admin/services/interface/admin-service.interface';
import { MailModule } from 'src/common/helpers/mailer/mailer.module';
import { MAIL_SERVICE } from 'src/common/helpers/mailer/mail-service.interface';
import { MailService } from 'src/common/helpers/mailer/mailer.service';

@Module({
  imports: [
    RedisModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TrainerModule,
    MailModule,
  ],
  controllers: [AdminController],
  providers: [
    {
      provide: ADMIN_SERVICE,
      useClass: AdminService,
    },
    { provide: IJwtTokenService, useClass: JwtTokenService },
    { provide: MAIL_SERVICE, useClass: MailService },
  ],
})
export class AdminModule {}
