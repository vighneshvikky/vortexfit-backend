import { CreatePlanDto } from 'src/plans/dtos/plan.dto';
import { Plan, PlanDocument } from 'src/plans/schema/plan.schema';

export const IPLANREPOSITORY = Symbol('IPLANREPOSITORY');

export interface IPlanRepository {
  create(data: CreatePlanDto): Promise<PlanDocument>;
  findAll(): Promise<PlanDocument[]>;
  findById(id: string): Promise<PlanDocument>;
  getUserPlan(role: string): Promise<PlanDocument[]>;
  update(id: string, data: Partial<Plan>): Promise<PlanDocument>;
  delete(id: string): Promise<boolean>;
}
