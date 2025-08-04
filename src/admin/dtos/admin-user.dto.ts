export class AdminUserDto {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'trainer';
  isBlocked: boolean;
  createdAt: Date;
  image: string;
  isVerified: boolean;

  // User-specific
  dob?: string;
  height?: number;
  heightUnit?: string;
  weight?: number;
  weightUnit?: string;
  fitnessLevel?: string;
  fitnessGoals?: string[];
  trainingTypes?: string[];
  preferredTime?: string;
  equipments?: string[];

  // Trainer-specific
  phoneNumber?: string;
  verifiedAt?: Date;
  verificationStatus?: string;
  rejectionReason?: string;
  rejectedAt?: Date;
  category?: string;
  specialization?: string;
  experience?: number;
  bio?: string;
  certificationUrl?: string;
  idProofUrl?: string;
  pricing?: {
    oneToOneSession: number;
    workoutPlan: number;
  };
}
