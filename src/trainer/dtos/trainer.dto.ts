import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsNumber,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';

class PricingDto {
  @IsNumber()
  @IsOptional()
  oneToOneSession?: number;

  @IsNumber()
  @IsOptional()
  workoutPlan?: number;
}

export class TrainerProfileDto {
  @IsOptional()
  @IsString()
  _id?: string;
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('IN')
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsIn(Object.values(VerificationStatus))
  verificationStatus?: VerificationStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  isBlocked?: boolean;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  certificationUrl?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  idProofUrl?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;
}
