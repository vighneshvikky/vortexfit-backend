import { Inject, Injectable } from '@nestjs/common';
import { ISchedulingService } from '../interface/scheduling.interface';
import { IScheduleRepository } from '../../repositories/interface/scheduling.repository.interface';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
} from '../../dtos/scheduling.dto';
import { SchedulingRule } from '../../schemas/schedule.schema';
import { Types } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

@Injectable()
export class ScheduleService implements ISchedulingService {
  constructor(
    @Inject(IScheduleRepository)
    private readonly scheduleRepository: IScheduleRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  async createSchedule(
    data: CreateScheduleDto,
    id: string,
  ): Promise<SchedulingRule> {
    const objectId = new Types.ObjectId(id);
    this.logger.log(`Creating schedule for trainerId: ${id}`);
    return this.scheduleRepository.create({ ...data, trainerId: objectId });
  }

  async updateSchedule(
    id: string,
    data: UpdateScheduleDto,
  ): Promise<SchedulingRule | null> {
    return this.scheduleRepository.update(id, data);
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return this.scheduleRepository.delete(id);
  }
}
