import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Trainer } from '../schemas/trainer.schema';
import { PasswordUtil } from 'src/common/helpers/password.util';
import { ITrainerRepository } from '../interfaces/trainer-repository.interface';
import { ITrainerService } from '../interfaces/trainer-service.interface';
import {
  AWS_S3_SERVICE,
  IAwsS3Service,
} from 'src/common/aws/interface/aws-s3-service.interface';
import { TrainerProfileDto } from '../dtos/trainer.dto';
import { TrainerMapper } from '../mapper/trainer.mapper';

@Injectable()
export class TrainerService implements ITrainerService {
  constructor(
    @Inject(ITrainerRepository)
    private readonly trainerRepo: ITrainerRepository,
    @Inject(AWS_S3_SERVICE) readonly awsS3Service: IAwsS3Service,
  ) {}

  async findByEmail(email: string): Promise<Trainer | null> {
    return this.trainerRepo.findByEmail(email);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.trainerRepo.updatePassword(userId, newPassword);
  }

  async create(payload: Partial<Trainer>): Promise<Trainer> {
    if (payload.password) {
      payload.password = await PasswordUtil.hashPassword(payload.password);
    }
    return this.trainerRepo.create(payload);
  }

  async createTrainerWithFiles(data: {
    name: string;
    email: string;
    phoneNumber: string;
    specialization: string;
    experience: number;
    bio: string;
    idProofUrl: string;
    certificationUrl: string;
  }): Promise<Trainer> {
    return this.trainerRepo.createTrainerWithFiles(data);
  }

  async findById(id: string): Promise<Trainer | null> {
    return this.trainerRepo.findById(id);
  }

  async updateTrainerProfile(
    trainerId: string,
    dto: TrainerProfileDto,
  ): Promise<TrainerProfileDto> {
    const trainer = await this.trainerRepo.findById(trainerId);
    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const updatePayload: Partial<Trainer> = {
      ...dto,
      pricing: dto.pricing
        ? {
            oneToOneSession:
              dto.pricing.oneToOneSession ??
              trainer.pricing?.oneToOneSession ??
              0,
            workoutPlan:
              dto.pricing.workoutPlan ?? trainer.pricing?.workoutPlan ?? 0,
          }
        : trainer.pricing,
    };

    const updatedTrainer = await this.trainerRepo.updateById(
      trainerId,
      updatePayload,
    );
    return TrainerMapper.toProfileDto(updatedTrainer);
  }
}
