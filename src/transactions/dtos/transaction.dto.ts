import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateTransactionDto {
  @IsMongoId()
  fromUser: Types.ObjectId;

  @IsMongoId()
  toUser: Types.ObjectId;

  @IsNumber()
  amount: number;

  @IsEnum(['BOOKING', 'SUBSCRIPTION'])
  sourceType: 'BOOKING' | 'SUBSCRIPTION' | 'CREDIT';

  @IsMongoId()
  sourceId: Types.ObjectId;

  @IsOptional()
  paymentId?: string;

  @IsOptional()
  orderId?: string;

  @IsOptional()
  paymentSignature?: string;
}

export class TransactionFilterDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsEnum(['BOOKING', 'SUBSCRIPTION'])
  sourceType?: 'BOOKING' | 'SUBSCRIPTION' | 'CREDIT'; 

  @IsOptional()
  sortBy?: 'createdAt' | 'amount';

  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
