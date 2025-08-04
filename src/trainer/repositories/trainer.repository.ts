import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trainer, TraninerDocument } from '../schemas/trainer.schema';
import { BaseRepository } from '../../common/repositories/base.repository';
import { ITrainerRepository } from '../interfaces/trainer-repository.interface';

@Injectable()
export class TrainerRepository
  extends BaseRepository<TraninerDocument>
  implements ITrainerRepository
{
  constructor(@InjectModel(Trainer.name) model: Model<TraninerDocument>) {
    super(model);
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
    return this.create({
      ...data,
      role: 'trainer',
    });
  }

  async findById(id: string): Promise<TraninerDocument | null> {
    return this.model.findById(id).exec();
  }

  async updateTrainerWithFiles(
    id: string,
    data: {
      name: string;
      email: string;
      phoneNumber: string;
      specialization: string;
      experience: number;
      bio: string;
      idProofUrl: string;
      certificationUrl: string;
    },
  ): Promise<Trainer | null> {
    return this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async findTrainersBySearch(search?: string): Promise<Trainer[]> {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    return this.model.find(query).exec();
  }
}
