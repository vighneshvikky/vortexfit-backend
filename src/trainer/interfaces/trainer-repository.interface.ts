import { IBaseRepository } from 'src/common/interface/base-repository.interface';
import { Trainer } from '../schemas/trainer.schema';
import { AuthUserModel } from '@/common/model/base-model';

export const ITRAINEREPOSITORY = Symbol('ITRAINEREPOSITORY');

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
  findAuthUserByEmail(email: string): Promise<AuthUserModel | null>;

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

  findTrainersBySearch(
    search: string,
    page: number,
    limit: number,
  ): Promise<Trainer[]>;
  countTrainersBySearch(search: string): Promise<number>;
  countBlockedTrainers(search: string): Promise<number>;
  findBlockedTrainers(search: string): Promise<Trainer[]>;
}
