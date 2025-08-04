import { IUserRoleService } from 'src/common/interface/user-role-service.interface';
import { ITrainerRepository } from 'src/trainer/interfaces/trainer-repository.interface';
import { IUserRepository } from 'src/user/interfaces/user-repository.interface';

export const AUTH_SERVICE_REGISTRY = 'AUTH_SERVICE_REGISTRY';

export interface IAuthServiceRegistry {
  getServiceByRole(role: string): IUserRoleService;
}
