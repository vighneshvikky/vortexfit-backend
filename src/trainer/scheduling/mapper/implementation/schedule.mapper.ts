import { SchedulingRule } from '../../schemas/schedule.schema';
import { ScheduleDto } from '../interface/schedule.mapper.interface';

export class ScheduleMapper {
  static toDto(schedule: SchedulingRule): ScheduleDto {
    return {
      id: schedule._id.toString(),
      trainerId: schedule.trainerId.toString(),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      startDate: new Date(schedule.startDate).toISOString(),
      endDate: new Date(schedule.endDate).toISOString(),
      bufferTime: schedule.bufferTime,
      sessionType: schedule.sessionType,
      daysOfWeek: schedule.daysOfWeek,
      slotDuration: schedule.slotDuration,
      maxBookingsPerSlot: schedule.maxBookingsPerSlot,
      exceptionalDays: schedule.exceptionalDays ?? [],
      isActive: schedule.isActive,
    };
  }

  static toDtoArray(schedules: SchedulingRule[]): ScheduleDto[] {
    return schedules.map((schedule) => this.toDto(schedule));
  }
}
