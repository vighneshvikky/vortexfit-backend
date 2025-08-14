import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Inject,
  Req,
  Post,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { NotBlockedGuard } from 'src/common/guards/notBlocked.guard';
import {
  ITrainerService,
  TRAINER_SERVICE,
} from '../interfaces/trainer-service.interface';
import { TrainerProfileDto } from '../dtos/trainer.dto';
import { Request } from 'express';
@Controller('trainers')
export class TrainerController {
  constructor(
    @Inject(TRAINER_SERVICE) private readonly trainerService: ITrainerService,
  ) {}



  @Patch('update-trainer-profile')
  @UseGuards(JwtAuthGuard, RolesGuard, NotBlockedGuard)
  @Roles('trainer')
  async updateTrainerProfile(
    @Req() req: Request,
    @GetUser('sub')
    trainerId: string,
    @Body() dto: TrainerProfileDto,
  ) {
    console.log('dto', dto)
    return this.trainerService.updateTrainerProfile(trainerId, dto);
  }
}
