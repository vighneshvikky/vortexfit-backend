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
import {
  IUSEREPOSITORY,
  IUserRepository,
} from '@/user/interfaces/user-repository.interface';
import {
  ITRAINEREPOSITORY,
  ITrainerRepository,
} from '@/trainer/interfaces/trainer-repository.interface';

@Injectable()
export class UserRoleServiceRegistry implements IAuthServiceRegistry {
  private readonly services: Map<string, IUserService | ITrainerService>;
  private readonly repos: Map<string, IUserRepository | ITrainerRepository>;

  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(TRAINER_SERVICE) private readonly trainerService: ITrainerService,
    @Inject(IUSEREPOSITORY) private readonly _userRepository: IUserRepository,
    @Inject(ITRAINEREPOSITORY)
    private readonly _trainerRepository: ITrainerRepository,
  ) {
    this.services = new Map<string, IUserService | ITrainerService>([
      ['user', this.userService],
      ['trainer', this.trainerService],
    ]);

    this.repos = new Map<string, IUserRepository | ITrainerRepository>([
      ['user', this._userRepository],
      ['trainer', this._trainerRepository],
    ]);
  }

  getServiceByRole(role: string): IUserService | ITrainerService {
    const service = this.services.get(role);
    if (!service) {
      throw new Error(`No service found for role: ${role}`);
    }
    return service;
  }

  getRepoByRole(role: string): IUserRepository | ITrainerRepository {
    const repo = this.repos.get(role);
    if (!repo) {
      throw new Error(`No repo found for role: ${role}`);
    }
    return repo;
  }
}
