import { CreatePlanDto, PlanDto } from 'src/plans/dtos/plan.dto';

export const IPLANSERVICE = Symbol('IPLANSERVICE');

export interface IPlanService {
  createPlan(data: CreatePlanDto): Promise<PlanDto>;
  getAllPlans(): Promise<PlanDto[]>;
  getPlanById(id: string): Promise<PlanDto>;
  updatePlan(id: string, data: Partial<PlanDto>): Promise<PlanDto>;
  getUserPlan(role: string): Promise<PlanDto[]>;
  delete(id: string): Promise<boolean>;
}
