import { IBaseRepository } from 'src/common/interface/base-repository.interface';
import { User } from '../schemas/user.schema';
import { AuthUserModel } from '@/common/model/base-model';

export const IUSEREPOSITORY = Symbol('IUSEREPOSITORY');

export interface IUserRepository extends IBaseRepository<User> {
  findById(id: string): Promise<User>;
  findUsersBySearch(
    search: string,
    page: number,
    limit: number,
  ): Promise<User[]>;
  countUsersBySearch(search: string): Promise<number>;
  findBlockedUsers(search: string): Promise<User[]>;
  countBlockedUsers(search: string): Promise<number>;
  findAuthUserByEmail(email: string): Promise<AuthUserModel | null>;
}
