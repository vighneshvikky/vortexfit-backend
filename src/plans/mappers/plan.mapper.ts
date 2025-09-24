import { PlanDto } from '../dtos/plan.dto';
import { PlanDocument } from '../schema/plan.schema';

export class PlanMapper {
  static toDto(plan: PlanDocument): PlanDto {
    return {
      _id: plan._id.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingCycle: plan.billingCycle,
      isActive: plan.isActive,
      role: plan.role,
      features: plan.features,
      limits: {
        oneOnOneSessions: plan.limits.oneOnOneSessions,
        aiQueries: plan.limits.aiQueries,
        chatAccess: plan.limits.chatAccess,
        videoAccess: plan.limits.videoAccess,
        communityAccess: plan.limits.communityAccess,
        prioritySupport: plan.limits.prioritySupport,
      },
      sortOrder: plan.sortOrder,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  static toDtos(plans: PlanDocument[]): PlanDto[] {
    return plans.map((p) => this.toDto(p));
  }
}
