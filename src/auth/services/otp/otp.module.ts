import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailModule } from 'src/common/helpers/mailer/mailer.module';
import { RedisModule } from 'src/redis/redis.module';
import { UserModule } from 'src/user/user.module';
import { TrainerModule } from 'src/trainer/trainer.module';
import { MAIL_SERVICE } from 'src/common/helpers/mailer/mail-service.interface';
import { MailService } from 'src/common/helpers/mailer/mailer.service';

@Module({
  imports: [MailModule, RedisModule, UserModule, TrainerModule],
  providers: [
    OtpService,
    {
      provide: MAIL_SERVICE,
      useClass: MailService,
    },
  ],
  exports: [OtpService],
})
export class OtpModule {}
