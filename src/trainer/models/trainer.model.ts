import { BaseModel } from 'src/common/model/base-model';

export class TrainerModel extends BaseModel {
  constructor(
    public readonly verificationStatus?: string,
    public readonly phoneNumber?: string,
    public readonly category?: string,
    public readonly specialization?: string,
    public readonly experience?: number,
    public readonly bio?: string,
    public readonly certificationUrl?: string,
    public readonly idProofUrl?: string,
    public readonly rejectionReason?: string,
    public readonly rejectedAt?: Date,
    
    public readonly pricing?: {
      oneToOneSession: number;
      workoutPlan: number;
    },
  ) {
    super();
  }
}
