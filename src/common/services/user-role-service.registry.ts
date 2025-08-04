import { Inject, Injectable } from '@nestjs/common';
import { IUserRoleService } from '../interface/user-role-service.interface';
import {
  IUserService,
  USER_SERVICE,
} from 'src/user/interfaces/user-service.interface';
import {
  ITrainerService,
  TRAINER_SERVICE,
} from 'src/trainer/interfaces/trainer-service.interface';
import { IAuthServiceRegistry } from 'src/auth/interfaces/auth-service-registry.interface';
import { ITrainerRepository } from 'src/trainer/interfaces/trainer-repository.interface';
import { IUserRepository } from 'src/user/interfaces/user-repository.interface';

@Injectable()
export class UserRoleServiceRegistry implements IAuthServiceRegistry {
  private readonly services: Map<string, IUserRoleService>;

  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(TRAINER_SERVICE) private readonly trainerService: ITrainerService,
  ) {
    this.services = new Map<string, IUserRoleService>([
      ['user', this.userService],
      ['trainer', this.trainerService],
    ]);
  }

  getServiceByRole(role: string): IUserRoleService {
    const service = this.services.get(role);
    if (!service) {
      throw new Error(`No service found for role: ${role}`);
    }
    return service;
  }
 
  // getRepository(role: string): IUserRepository | ITrainerRepository {
  //   if()
  // }
  
}
