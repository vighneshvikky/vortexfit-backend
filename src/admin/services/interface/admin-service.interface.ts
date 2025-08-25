import { User } from 'src/user/schemas/user.schema';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { PaginatedResult } from 'src/common/interface/base-repository.interface';
import { AdminUserDto } from 'src/admin/dtos/admin-user.dto';

export const ADMIN_SERVICE = 'ADMIN_SERVICE';

export interface GetUsersOptions {
  search?: string;
  role?: 'user' | 'trainer';
  page?: number;
  limit?: number;
  filter?: 'all' | 'user' | 'trainer' | 'blocked';
}

export interface IAdminService {
  verifyAdminLogin(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  getUsers(options: GetUsersOptions): Promise<PaginatedResult<AdminUserDto>>;

  toggleBlockStatus(
    id: string,
    role: 'user' | 'trainer',
  ): Promise<AdminUserDto>;

  getUnverifiedTrainers(
    options: GetUsersOptions,
  ): Promise<PaginatedResult<AdminUserDto>>;

  approveTrainer(trainerId: string): Promise<AdminUserDto>;

  rejectTrainer(trainerId: string, reason: string): Promise<AdminUserDto>;
}
