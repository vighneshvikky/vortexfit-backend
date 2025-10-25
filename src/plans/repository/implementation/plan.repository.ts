import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from 'src/plans/schema/plan.schema';
import { IPlanRepository } from '../interface/plan.repository.interface';
import { CreatePlanDto } from 'src/plans/dtos/plan.dto';

@Injectable()
export class PlanRepository implements IPlanRepository {
  constructor(
    @InjectModel(Plan.name) private _planModel: Model<PlanDocument>,
  ) {}

  async create(data: CreatePlanDto): Promise<PlanDocument> {
    const dup = await this._planModel.find({name: CreatePlanDto.name});
    if(dup.length !== 0){
      throw new BadRequestException('This Plan Name Already Exists.')
    }
    const plan = new this._planModel(data);
    return plan.save();
  }

  async findAll(): Promise<PlanDocument[]> {
    return this._planModel
      .find({ isActive: true })
      .sort({ sortOrder: 1 })
      .exec();
  }

  async findById(id: string): Promise<PlanDocument> {
    const plan = await this._planModel.findById(id).exec();
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async getUserPlan(role: string): Promise<PlanDocument[]> {
    return await this._planModel.find({ role: role });
  }

  async update(id: string, data: Partial<Plan>): Promise<PlanDocument> {
    const updated = await this._planModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .exec();
    if (!updated) throw new NotFoundException('Plan not found');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    // const updated = await this._planModel
    //   .findByIdAndUpdate(id, { isActive: false }, { new: true })
    //   .exec();
 
    const updated =  await this._planModel.deleteOne({_id: id}).exec()
    return updated.deletedCount === 1;
  }
}
