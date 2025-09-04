import { UserProfileDto } from '../dtos/user.mapper.dto';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { User } from '../schemas/user.schema';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface FindApprovedTrainerQuery {
  category?: string;
  name?: string | { $regex: string; $options: string };
}

export interface IUserService  {
  findByIdAndUpdate(
    userId: string,
    data: Partial<UserProfileDto>,
  ): Promise<UserProfileDto | null>;
  findTrainer(id: string): Promise<Trainer | null>;
  findApprovedTrainer(filters: FindApprovedTrainerQuery): Promise<Trainer[]>;
  findById(id: string): Promise<UserProfileDto | null>;
  findByEmail(email: string): Promise<User | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}
