import { Inject, Injectable } from '@nestjs/common';
import {
  IPLANREPOSITORY,
  IPlanRepository,
} from 'src/plans/repository/interface/plan.repository.interface';
import { IPlanService } from '../interface/plan.service.interface';
import { CreatePlanDto, PlanDto } from 'src/plans/dtos/plan.dto';
import { PlanMapper } from 'src/plans/mappers/plan.mapper';

@Injectable()
export class PlanService implements IPlanService {
  constructor(
    @Inject(IPLANREPOSITORY)
    private readonly _planRepository: IPlanRepository,
  ) {}

  async createPlan(data: CreatePlanDto): Promise<PlanDto> {
    const plan = await this._planRepository.create(data);
    return PlanMapper.toDto(plan);
  }
  async getAllPlans(): Promise<PlanDto[]> {
    const plans = await this._planRepository.findAll();
    return PlanMapper.toDtos(plans);
  }

  async getPlanById(id: string): Promise<PlanDto> {
    const plan = await this._planRepository.findById(id);
    return PlanMapper.toDto(plan);
  }

  async updatePlan(id: string, data: Partial<PlanDto>): Promise<PlanDto> {
    const plan = await this._planRepository.update(id, data);
    return PlanMapper.toDto(plan);
  }

  async getUserPlan(role: string): Promise<PlanDto[]> {
    const plans = await this._planRepository.getUserPlan(role);
    return PlanMapper.toDtos(plans);
  }

  async delete(id: string): Promise<boolean> {
    return  await this._planRepository.delete(id);
   
  }
}
