import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trainer, TrainerDocument } from './trainer.schema';

@Injectable()
export class TrainerRepository {
  constructor(
    @InjectModel(Trainer.name) private trainerModel: Model<TrainerDocument>,
  ) {}

  async findByEmail(email: string): Promise<TrainerDocument | null> {
    console.log('email', email);
    return this.trainerModel.findOne({ email }).exec();
  }

  async createTrainer(trainerData): Promise<TrainerDocument> {
    console.log('trainerData', trainerData);
    const createdTrainer = await this.trainerModel.create(trainerData);
    console.log('createdTrainer', createdTrainer);
    return createdTrainer;
  }

  async addRefreshToken(trainerId: string, token: string): Promise<void> {
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.trainerModel.findByIdAndUpdate(trainerId, {
      refreshToken: token,
      refreshTokenExpiresAt: expiry,
    });
  }

  async findTrainerById(trainerId: string) {
    return await this.trainerModel.findById(trainerId);
  }

  async findAllTrainers() {
    return await this.trainerModel.find();
  }

  async findByIdAndUpdate(trainerId: string, isBlocked: boolean) {
    return this.trainerModel
      .findByIdAndUpdate(trainerId, { isBlocked }, { new: true })
      .exec();
  }
}
