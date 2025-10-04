import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Inject,
  Get,
  Param,
} from '@nestjs/common';

import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { NotBlockedGuard } from 'src/common/guards/notBlocked.guard';
import {
  ITrainerService,
  TRAINER_SERVICE,
} from '../interfaces/trainer-service.interface';
import { TrainerProfileDto } from '../dtos/trainer.dto';
import { UserProfileDto } from 'src/user/dtos/user.mapper.dto';
import {
  IUserService,
  USER_SERVICE,
} from 'src/user/interfaces/user-service.interface';

@Controller('trainers')
export class TrainerController {
  constructor(
    @Inject(TRAINER_SERVICE) private readonly _trainerService: ITrainerService,
    @Inject(USER_SERVICE) private readonly _userService: IUserService,
  ) {}

  @Patch('update-trainer-profile')
  @UseGuards(RolesGuard, NotBlockedGuard)
  @Roles('trainer')
  async updateTrainerProfile(
    @GetUser('sub')
    trainerId: string,
    @Body() dto: TrainerProfileDto,
  ) {
    return this._trainerService.updateTrainerProfile(trainerId, dto);
  }

  @UseGuards(RolesGuard, NotBlockedGuard)
  @Roles('trainer')
  @Get('getuserData/:id')
  async getUserData(
    @Param('id') id: string,
  ): Promise<UserProfileDto | TrainerProfileDto | null> {
    return await this._userService.findById(id);
  }
}
