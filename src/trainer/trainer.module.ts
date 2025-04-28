import { forwardRef, Module } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { HashingModule } from 'src/auth/modules/hashing.module';
import { OtpModule } from 'src/auth/modules/otp.module';
import { AuthModule } from 'src/auth/auth.module';
import { TrainerRepository } from './trainer.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { TempUser, TempUserSchema } from 'src/auth/schema/temp-user.schema';
import { Trainer, TrainerSchema } from './trainer.schema';
import { MailService } from 'src/common/utils/mailer/mailer.service';
import { DatabaseModule } from 'src/database/database.module';
import { TrainerController } from './trainer.controller';


@Module({
  imports: [
    DatabaseModule,
    HashingModule,
    OtpModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: TempUser.name, schema: TempUserSchema },
      { name: Trainer.name, schema: TrainerSchema },
    ]),
  ],
  providers: [TrainerService, TrainerRepository, MailService],
  exports: [TrainerService, TrainerRepository],
  controllers: [TrainerController], 
})
export class TrainerModule {}
