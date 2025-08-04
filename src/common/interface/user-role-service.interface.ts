import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { User } from 'src/user/schemas/user.schema';

export interface IUserRoleService {
  findByEmail(email: string): Promise<User | Trainer | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  findById(id: string): Promise<User | Trainer | null>;
}
