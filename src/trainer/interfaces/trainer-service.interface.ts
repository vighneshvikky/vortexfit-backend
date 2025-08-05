import { IUserRoleService } from 'src/common/interface/user-role-service.interface';
import { TrainerProfileDto } from '../dtos/trainer.dto';
import { Trainer } from '../schemas/trainer.schema';

export const TRAINER_SERVICE = 'TRAINER_SERVICE';

export interface ITrainerService extends IUserRoleService {
  create(payload: Partial<Trainer>): Promise<Trainer>;
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
  }): Promise<Trainer>;
  updateTrainerProfile(
    trainerId: string,
    dto: TrainerProfileDto,
  ): Promise<TrainerProfileDto>;
}
