import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

import { SessionType } from '../../enums/scheduling.enum';

export class ScheduleDto {
  @IsString()
  id: string;

  @IsString()
  trainerId: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsNumber()
  bufferTime: number;

  @IsEnum(SessionType)
  sessionType: SessionType;

  @IsArray()
  daysOfWeek: number[];

  @IsNumber()
  slotDuration: number;

  @IsOptional()
  @IsNumber()
  maxBookingsPerSlot?: number;

  @IsOptional()
  @IsArray()
  exceptionalDays?: string[];
}
