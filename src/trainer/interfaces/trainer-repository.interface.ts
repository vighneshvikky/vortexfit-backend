import { IBaseRepository } from 'src/common/interface/base-repository.interface';
import { Trainer } from '../schemas/trainer.schema';

export const ITrainerRepository = Symbol('ITrainerRepository');

export interface ITrainerRepository extends IBaseRepository<Trainer> {
  createTrainerWithFiles(data: {
    name: string;
    email: string;
    phoneNumber: string;
    specialization: string;
    experience: number;
    bio: string;
    idProofUrl: string;
    certificationUrl: string;
  }): Promise<Trainer>;

  findById(id: string): Promise<Trainer | null>;

  updateTrainerWithFiles(
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
  ): Promise<Trainer | null>;

  findTrainersBySearch(search?: string): Promise<Trainer[]>;
}
