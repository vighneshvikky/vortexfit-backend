import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PlanLimitsDto {
  @IsNumber()
  oneOnOneSessions: number | 'unlimited';

  @IsNumber()
  aiQueries: number | 'unlimited';

  @IsBoolean()
  chatAccess: boolean;

  @IsBoolean()
  videoAccess: boolean;

  @IsBoolean()
  communityAccess: boolean;

  @IsBoolean()
  prioritySupport: boolean;
}

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';

  @IsString()
  role: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ValidateNested()
  @Type(() => PlanLimitsDto)
  limits: PlanLimitsDto;
}

export interface PlanDto {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  isActive: boolean;
  role: 'user' | 'trainer';
  features: string[];
  limits: PlanLimitsDto;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}
