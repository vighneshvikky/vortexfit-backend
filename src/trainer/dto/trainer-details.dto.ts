import { IsString, IsEnum, IsNumber, IsOptional, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CertificationDto {
  @IsString()
  type: string;

  @IsString()
  document: string;

  @IsOptional()
  verified?: boolean;
}

export class TrainerDetailsDto {
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(['Cardio', 'Yoga', 'Martial Arts', 'Sports-Specific', 'Strength', 'Other'])
  @IsOptional()
  specialization?: string;

  @IsNumber()
  @Min(0)
  @Max(50)
  @IsOptional()
  experience?: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  @IsOptional()
  certifications?: CertificationDto[];

  @IsString()
  @IsOptional()
  idProof?: string;
} 