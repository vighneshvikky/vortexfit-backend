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
import { TrainerModel } from '../models/trainer.model';

@Injectable()
export class TrainerService implements ITrainerService {
  constructor(
    @Inject(ITrainerRepository)
    private readonly trainerRepo: ITrainerRepository,
    @Inject(AWS_S3_SERVICE) readonly awsS3Service: IAwsS3Service,
  ) {}

  async findByEmail(email: string): Promise<TrainerModel | null> {
    const trainerDoc = await this.trainerRepo.findByEmail(email);
    return trainerDoc ? TrainerMapper.toDomain(trainerDoc) : null;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.trainerRepo.updatePassword(userId, newPassword);
  }

  async create(payload: Partial<Trainer>): Promise<TrainerModel | null> {
    if (payload.password) {
      payload.password = await PasswordUtil.hashPassword(payload.password);
    }
    const trainerDoc = await this.trainerRepo.create(payload);
    return TrainerMapper.toDomain(trainerDoc);
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
  }): Promise<TrainerModel | null> {
    const trainerDoc = await this.trainerRepo.createTrainerWithFiles(data);
    return TrainerMapper.toDomain(trainerDoc);
  }

  async findById(id: string): Promise<TrainerProfileDto | null> {
    const trainerDoc = await this.trainerRepo.findById(id);
    if (!trainerDoc) return null;

    const trainerDomain = TrainerMapper.toDomain(trainerDoc);
    return TrainerMapper.toProfileDto(trainerDomain);
  }

  async updateTrainerProfile(
    trainerId: string,
    dto: TrainerProfileDto,
  ): Promise<TrainerProfileDto | null> {
    const trainerDoc = await this.trainerRepo.findById(trainerId);
    if (!trainerDoc) {
      throw new NotFoundException('Trainer not found');
    }

    const updatePayload: Partial<Trainer> = {
      ...dto,
      pricing: dto.pricing
        ? {
            oneToOneSession:
              dto.pricing.oneToOneSession ??
              trainerDoc.pricing?.oneToOneSession ??
              0,
            workoutPlan:
              dto.pricing.workoutPlan ?? trainerDoc.pricing?.workoutPlan ?? 0,
          }
        : trainerDoc.pricing,
    };

    const updatedDoc = await this.trainerRepo.updateById(trainerId, updatePayload);
    const updatedDomain = TrainerMapper.toDomain(updatedDoc);

    return TrainerMapper.toProfileDto(updatedDomain);
  }
}
