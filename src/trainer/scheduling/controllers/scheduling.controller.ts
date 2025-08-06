import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UsePipes,
  Logger,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ISchedulingService,
  SCHEDULE_SERVICE,
} from '../services/interface/scheduling.interface';
import { CreateScheduleDto, UpdateScheduleDto } from '../dtos/scheduling.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { NotBlockedGuard } from 'src/common/guards/notBlocked.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@Controller('schedules')
export class ScheduleController {
  constructor(
    @Inject(SCHEDULE_SERVICE)
    private readonly schedulingService: ISchedulingService,
  ) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('trainer')
  @Post('create')
  @UsePipes()
  async create(
    @Body() dto: CreateScheduleDto,
    @GetUser('sub')
    trainerId: string,
  ) {
    console.log('dto', dto);
    return this.schedulingService.createSchedule(dto, trainerId);
  }

  @Put(':id/toggle')
  @UsePipes()
  async update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.schedulingService.updateSchedule(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.schedulingService.deleteSchedule(id);
  }
}
