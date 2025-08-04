import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  heightUnit?: string;

  @IsOptional()
  @IsNumber()
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

  @IsOptional()
  image?: string;
}
