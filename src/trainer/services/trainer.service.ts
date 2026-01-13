import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Trainer } from '../schemas/trainer.schema';
import {
  ITRAINEREPOSITORY,
  ITrainerRepository,
} from '../interfaces/trainer-repository.interface';
import { ITrainerService } from '../interfaces/trainer-service.interface';
import {
  AWS_S3_SERVICE,
  IAwsS3Service,
} from 'src/common/aws/interface/aws-s3-service.interface';
import { TrainerProfileDto } from '../dtos/trainer.dto';
import { TrainerMapper } from '../mapper/trainer.mapper';
import { TrainerModel } from '../models/trainer.model';
import { Types } from 'mongoose';
import {
  IPasswordUtil,
  PASSWORD_UTIL,
} from 'src/common/interface/IPasswordUtil.interface';

@Injectable()
export class TrainerService implements ITrainerService {
  constructor(
    @Inject(ITRAINEREPOSITORY)
    private readonly _trainerRepo: ITrainerRepository,
    @Inject(AWS_S3_SERVICE) readonly _awsS3Service: IAwsS3Service,
    @Inject(PASSWORD_UTIL) readonly _passwordUtil: IPasswordUtil,
  ) {}

  async findByEmail(email: string): Promise<TrainerModel | null> {
    const trainerDoc = await this._trainerRepo.findByEmail(email);
    return trainerDoc ? TrainerMapper.toDomain(trainerDoc) : null;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this._trainerRepo.updatePassword(userId, newPassword);
  }

  async create(payload: Partial<Trainer>): Promise<TrainerModel | null> {
    if (payload.password) {
      payload.password = await this._passwordUtil.hashPassword(
        payload.password,
      );
    }
    const trainerDoc = await this._trainerRepo.create(payload);
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
    const trainerDoc = await this._trainerRepo.createTrainerWithFiles(data);
    return TrainerMapper.toDomain(trainerDoc);
  }

  async findById(id: string): Promise<TrainerProfileDto | null> {
    const trainerDoc = await this._trainerRepo.findById(id);
    if (!trainerDoc) return null;

    const trainerDomain = TrainerMapper.toDomain(trainerDoc);
    return TrainerMapper.toProfileDto(trainerDomain);
  }

  async updateTrainerProfile(
    trainerId: string,
    dto: TrainerProfileDto,
  ): Promise<TrainerProfileDto | null> {
    const trainerDoc = await this._trainerRepo.findById(trainerId);
    if (!trainerDoc) {
      throw new NotFoundException('Trainer not found');
    }

    const updatePayload: Partial<Trainer> = {
      ...dto,
      _id: dto._id ? new Types.ObjectId(dto._id) : undefined,
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

    const updatedDoc = await this._trainerRepo.updateById(
      trainerId,
      updatePayload,
    );
    const updatedDomain = TrainerMapper.toDomain(updatedDoc);

    return TrainerMapper.toProfileDto(updatedDomain);
  }
}
