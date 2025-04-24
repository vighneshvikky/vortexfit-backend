import { Module } from '@nestjs/common';
import { MailService } from 'src/common/utils/mailer/mailer.service';
import { OtpService } from '../services/otp.service';
import { OtpRepository } from '../repository/otp-repository';
import { OTP_REPOSITORY } from '../../common/constants';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    OtpService,
    MailService,
    {
      provide: OTP_REPOSITORY,
      useClass: OtpRepository,
    },
  ],
  exports: [OtpService, OTP_REPOSITORY],
})
export class OtpModule {}
