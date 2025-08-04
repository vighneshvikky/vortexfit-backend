import { forwardRef, Module } from '@nestjs/common';
import { TrainerController } from './controllers/trainer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trainer, TrainerSchema } from './schemas/trainer.schema';
import { TrainerRepository } from './repositories/trainer.repository';
import { TrainerService } from './services/trainer.service';
import { AwsS3Service } from 'src/common/aws/services/aws-s3.service';
import { ITrainerRepository } from './interfaces/trainer-repository.interface';
import { JwtModule } from '@nestjs/jwt';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { UserModule } from 'src/user/user.module';
import { TRAINER_SERVICE } from './interfaces/trainer-service.interface';
import { AWS_S3_SERVICE } from 'src/common/aws/interface/aws-s3-service.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Trainer.name,
        schema: TrainerSchema,
      },
    ]),
    JwtModule.register({}),
    forwardRef(() => UserModule),
  ],
  controllers: [TrainerController],
  providers: [
    TrainerRepository,
    {
      provide: ITrainerRepository,
      useClass: TrainerRepository,
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService,
    },
    {
      provide: TRAINER_SERVICE,
      useClass: TrainerService,
    },
    {
      provide: AWS_S3_SERVICE,
      useClass: AwsS3Service,
    },
  ],
  exports: [
    { provide: ITrainerRepository, useClass: TrainerRepository },
    TRAINER_SERVICE,
  ],
})
export class TrainerModule {}
