import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trainer, TrainerDocument } from './trainer.schema';
import { TrainerDetailsDto } from './dto/trainer-details.dto';

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

  /**
   * Updates trainer details in the database
   * @param trainerId The ID of the trainer to update
   * @param trainerDetails The details to update
   * @returns The updated trainer document
   */
  async updateTrainerDetails(
    trainerId: string,
    trainerDetails: TrainerDetailsDto,
  ): Promise<TrainerDocument | null> {
    const updateData: Partial<Trainer> = {};
    
    if (trainerDetails.phoneNumber !== undefined) {
      updateData.phoneNumber = trainerDetails.phoneNumber;
    }
    
    if (trainerDetails.specialization !== undefined) {
      updateData.specialization = trainerDetails.specialization;
    }
    
    if (trainerDetails.experience !== undefined) {
      updateData.experience = trainerDetails.experience;
    }
    
    if (trainerDetails.bio !== undefined) {
      updateData.bio = trainerDetails.bio;
    }
    
    if (trainerDetails.certifications !== undefined) {
      updateData.certifications = trainerDetails.certifications.map(cert => ({
        type: cert.type,
        document: cert.document,
        verified: cert.verified || false
      }));
    }
    
    if (trainerDetails.idProof !== undefined) {
      updateData.idProof = trainerDetails.idProof;
    }
    
    return this.trainerModel
      .findByIdAndUpdate(trainerId, updateData, { new: true })
      .exec();
  }

  /**
   * Adds a certification to a trainer
   * @param trainerId The ID of the trainer
   * @param certification The certification to add
   * @returns The updated trainer document
   */
  async addCertification(
    trainerId: string,
    certification: { type: string; document: string; verified: boolean },
  ): Promise<TrainerDocument | null> {
    return this.trainerModel
      .findByIdAndUpdate(
        trainerId,
        { $push: { certifications: certification } },
        { new: true },
      )
      .exec();
  }

  /**
   * Updates the ID proof of a trainer
   * @param trainerId The ID of the trainer
   * @param idProof The ID proof file path
   * @returns The updated trainer document
   */
  async updateIdProof(
    trainerId: string,
    idProof: string,
  ): Promise<TrainerDocument | null> {
    return this.trainerModel
      .findByIdAndUpdate(trainerId, { idProof }, { new: true })
      .exec();
  }
}
