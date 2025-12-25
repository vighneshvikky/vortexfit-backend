import { IBaseRepository } from 'src/common/interface/base-repository.interface';
import { User } from '../schemas/user.schema';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository extends IBaseRepository<User> {
  findById(id: string): Promise<User>;
  findUsersBySearch(search: string, page: number, limit: number): Promise<User[]>;
  countUsersBySearch(search: string): Promise<number>;
  findBlockedUsers(search: string): Promise<User[]>;
  countBlockedUsers(search: string): Promise<number>;
}
