import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsArray,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserProfileDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  image: string;

  @IsBoolean()
  isVerified: boolean;

  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  height?: number;

  @IsOptional()
  @IsString()
  heightUnit?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsString()
  weightUnit?: string;

  @IsOptional()
  @IsString()
  fitnessLevel?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fitnessGoals?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trainingTypes?: string[];

  @IsOptional()
  @IsString()
  preferredTime?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipments?: string[];

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
