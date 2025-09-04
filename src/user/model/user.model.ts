export class UserModel {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'trainer' | 'admin';
  provider: 'local' | 'google';
  isBlocked: boolean;
  isVerified: boolean;
  googleId?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;

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

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }


}