import { TrainerProfileDto } from 'src/trainer/dtos/trainer.dto';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { UserProfileDto } from 'src/user/dtos/user.mapper.dto';
import { User } from 'src/user/schemas/user.schema';

export interface IUserRoleService {
  findByEmail(email: string): Promise<User | Trainer | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}
