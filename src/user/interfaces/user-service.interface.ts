
import { UserProfileDto } from '../dtos/user.mapper.dto';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { IUserRoleService } from 'src/common/interface/user-role-service.interface';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface FindApprovedTrainerQuery {
  category?: string;
  name?: string | { $regex: string; $options: string };
}

export interface IUserService extends IUserRoleService {
  findByIdAndUpdate(
    userId: string,
    data: Partial<UserProfileDto>,
  ): Promise<UserProfileDto>;
  findTrainer(id: string): Promise<Trainer | null>;
  findApprovedTrainer(filters: FindApprovedTrainerQuery): Promise<Trainer[]>;
}
