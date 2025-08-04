import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  ITrainerService,
  TRAINER_SERVICE,
} from 'src/trainer/interfaces/trainer-service.interface';
import { TrainerService } from 'src/trainer/services/trainer.service';
import {
  IUserService,
  USER_SERVICE,
} from 'src/user/interfaces/user-service.interface';

@Injectable()
export class NotBlockedGuard implements CanActivate {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(TRAINER_SERVICE) private readonly trainerService: ITrainerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.sub || !user.role) {
      throw new ForbiddenException('User data is incomplete or missing');
    }

    if (user.role === 'user') {
      const dbUser = await this.userService.findById(user.sub);

      if (!dbUser || dbUser.isBlocked) {
        throw new ForbiddenException('User is blocked or not found');
      }
    } else if (user.role === 'trainer') {
      const dbTrainer = await this.trainerService.findById(user.sub);
      if (!dbTrainer || dbTrainer.isBlocked) {
        throw new ForbiddenException('Trainer is blocked or not found');
      }
    } else {
      throw new ForbiddenException('Invalid user role');
    }

    return true;
  }
}
