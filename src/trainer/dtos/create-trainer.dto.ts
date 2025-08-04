import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class PricingDto {
  @IsNumber()
  oneToOneSession: number;

  @IsNumber()
  workoutPlan: number;
}

export class CreateTrainerProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('IN')
  phoneNumber: string;

  @IsString()
  bio: string;

  @IsNumber()
  experience: number;

  @IsIn(['pending', 'approved', 'rejected', 'requested'])
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'requested';

  @IsString()
  category: string;

  @IsString()
  specialization: string;

  @IsString()
  certificationUrl: string;

  @IsString()
  idProofUrl: string;

  @ValidateNested()
  @Type(() => PricingDto)
  pricing: PricingDto;
}
