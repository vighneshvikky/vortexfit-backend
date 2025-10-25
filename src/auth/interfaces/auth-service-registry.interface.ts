
import { ITrainerService } from 'src/trainer/interfaces/trainer-service.interface';
import { IUserService } from 'src/user/interfaces/user-service.interface';

export const AUTH_SERVICE_REGISTRY = 'AUTH_SERVICE_REGISTRY';

export interface IAuthServiceRegistry {
  getServiceByRole(role: string): IUserService | ITrainerService;
}
