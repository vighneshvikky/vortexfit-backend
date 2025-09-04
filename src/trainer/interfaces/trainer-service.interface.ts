import { TrainerProfileDto } from '../dtos/trainer.dto';
import { TrainerModel } from '../models/trainer.model';

export const TRAINER_SERVICE = 'TRAINER_SERVICE';

export interface ITrainerService {
  create(payload: Partial<TrainerModel>): Promise<TrainerModel | null>;
  createTrainerWithFiles(data: {
    name: string;
    email: string;
    phoneNumber: string;
    specialization: string;
    experience: number;
    bio: string;
    idProofUrl: string;
    certificationUrl: string;
    verificationStatus: string;
  }): Promise<TrainerModel | null>;
  
  updateTrainerProfile(
    trainerId: string,
    dto: TrainerProfileDto,
  ): Promise<TrainerProfileDto | null>;
  
  findById(id: string): Promise<TrainerProfileDto | null>;
  
  findByEmail(email: string): Promise<TrainerModel | null>;
  
  updatePassword(userId: string, newPassword: string): Promise<void>;
}
