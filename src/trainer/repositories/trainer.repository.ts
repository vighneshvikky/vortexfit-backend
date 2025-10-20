import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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

  async findTrainersBySearch(
    search: string,
    page: number,
    limit: number,
  ): Promise<Trainer[]> {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    return this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countTrainersBySearch(search: string) {
    const query = search ? { fullName: { $regex: search, $options: 'i' } } : {};
    return this.model.countDocuments(query).exec();
  }

  async findBlockedTrainers(search: string): Promise<Trainer[]> {
  const query: FilterQuery<Trainer> = { isBlocked: true };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  
  return this.find(query);
}

async countBlockedTrainers(search: string): Promise<number> {
  const query: FilterQuery<Trainer> = { isBlocked: true };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  
  return this.model.countDocuments(query).exec();
}
}
