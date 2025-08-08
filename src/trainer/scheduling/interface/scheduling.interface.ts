import { CreateScheduleDto, UpdateScheduleDto } from '../dtos/scheduling.dto';
import { SchedulingRule } from '../schemas/schedule.schema';

export const SCHEDULE_SERVICE = 'SCHEDULE_SERVICE';

export interface ISchedulingService {
  createSchedule(data: CreateScheduleDto, id: string): Promise<SchedulingRule>;
  updateSchedule(
    id: string,
    data: UpdateScheduleDto,
  ): Promise<SchedulingRule | null>;
  deleteSchedule(id: string): Promise<boolean>;
  getSchedulesOfTrainer(id: string): Promise<SchedulingRule | null>;
}
