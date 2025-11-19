import { Inject, Injectable } from '@nestjs/common';

import {
  IUserService,
  USER_SERVICE,
} from 'src/user/interfaces/user-service.interface';
import {
  ITrainerService,
  TRAINER_SERVICE,
} from 'src/trainer/interfaces/trainer-service.interface';
import { IAuthServiceRegistry } from 'src/auth/interfaces/auth-service-registry.interface';

@Injectable()
export class UserRoleServiceRegistry implements IAuthServiceRegistry {
  private readonly services: Map<string, IUserService | ITrainerService>;

  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(TRAINER_SERVICE) private readonly trainerService: ITrainerService,
  ) {
    this.services = new Map<string, IUserService | ITrainerService>([
      ['user', this.userService],
      ['trainer', this.trainerService],
    ]);
  }

  getServiceByRole(role: string): IUserService | ITrainerService {
    const service = this.services.get(role);
    if (!service) {
      throw new Error(`No service found for role: ${role}`);
    }
    return service;
  }
}
