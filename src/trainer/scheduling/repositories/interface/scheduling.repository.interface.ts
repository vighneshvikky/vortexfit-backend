import { SchedulingRule } from '../../schemas/schedule.schema';

export const IScheduleRepository = Symbol('IScheduleRepository');

export interface IScheduleRepository {
  create(data: Partial<SchedulingRule>): Promise<SchedulingRule>;
  update(
    id: string,
    data: Partial<SchedulingRule>,
  ): Promise<SchedulingRule | null>;
  delete(id: string): Promise<boolean>;
}
