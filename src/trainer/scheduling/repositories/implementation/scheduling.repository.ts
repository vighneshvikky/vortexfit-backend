import { Injectable } from '@nestjs/common';
import { IScheduleRepository } from '../interface/scheduling.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  SchedulingRule,
  SchedulingRuleDocument,
} from '../../schemas/schedule.schema';
import { Model } from 'mongoose';

@Injectable()
export class ScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectModel(SchedulingRule.name)
    private readonly schedulingRuleModel: Model<SchedulingRuleDocument>,
  ) {}

  async create(data: Partial<SchedulingRule>): Promise<SchedulingRule> {
    const created = new this.schedulingRuleModel(data);
    return created.save();
  }

  async update(
    id: string,
    data: Partial<SchedulingRule>,
  ): Promise<SchedulingRule | null> {
    return this.schedulingRuleModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.schedulingRuleModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
