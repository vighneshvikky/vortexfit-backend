// import { IsString, IsEnum, IsNumber, IsArray } from 'class-validator';
// import { SessionType } from '../enums/scheduling.enum';
// import { extend } from 'dayjs';

// export class CreateScheduleDto {


//   @IsString()
//   startTime: string;

//   @IsString()
//   endTime: string;

//   @IsString()
//   startDate: string;

//   @IsString()
//   endDate: string;

//   @IsNumber()
//   bufferTime: number;

//   @IsEnum(SessionType)
//   sessionType: SessionType;

//   @IsArray()
//   daysOfWeek: number[];

//   @IsNumber()
//   slotDuration: number;

//   @IsNumber()
//   maxBookingsPerSlot?: number;

//   @IsArray()
//   execeptionalDays?: string[];



// }

// export class UpdateScheduleDto extends CreateScheduleDto {}

import { IsString, IsEnum, IsNumber, IsArray, IsOptional } from 'class-validator';
import { SessionType } from '../enums/scheduling.enum';

export class CreateScheduleDto {
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

  @IsOptional()
  @IsString()
  exceptionalDayInput?: string;
}


 export class UpdateScheduleDto extends CreateScheduleDto {}
