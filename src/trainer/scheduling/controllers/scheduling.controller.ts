import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UsePipes,
  Inject,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ISchedulingService,
  SCHEDULE_SERVICE,
} from '../services/interface/scheduling.interface';
import { CreateScheduleDto, UpdateScheduleDto } from '../dtos/scheduling.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { NotBlockedGuard } from 'src/common/guards/notBlocked.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppLoggerService } from 'src/common/logger/log.service';

@Controller('schedules')
export class ScheduleController {
  constructor(
    @Inject(SCHEDULE_SERVICE)
    private readonly _schedulingService: ISchedulingService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: AppLoggerService,
  ) {}
  @UseGuards(RolesGuard, NotBlockedGuard)
  @Roles('trainer')
  @Post('create')
  @UsePipes()
  async create(
    @Body() dto: CreateScheduleDto,
    @GetUser('sub')
    trainerId: string,
  ) {
    return this._schedulingService.createSchedule(dto, trainerId);
  }

  @UseGuards(RolesGuard, NotBlockedGuard)
  @Roles('trainer')
  @Delete('deleteSchedule/:id')
  async delete(@Param('id') id: string) {
    return this._schedulingService.deleteSchedule(id);
  }

  @UseGuards(RolesGuard, NotBlockedGuard)
  @Roles('trainer')
  @Get('getSchedules')
  async getSchedules(@GetUser('sub') trainerId: string) {
    return this._schedulingService.getSchedulesOfTrainer(trainerId);
  }
  // for users
  @UseGuards(RolesGuard, NotBlockedGuard)
  @Roles('user')
  @Get('generateSlots/:trainerId/:date')
  async getSlots(
    @Param('trainerId') trainerId: string,
    @Param('date') date: string,
  ) {
    return await this._schedulingService.getAvailableSlots(trainerId, date);
  }
}
