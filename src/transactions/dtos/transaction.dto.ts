import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsDateString,
  IsNumberString,
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
  sourceType: 'BOOKING' | 'SUBSCRIPTION';

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
  sourceType?: 'BOOKING' | 'SUBSCRIPTION';

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  sortBy?: 'createdAt' | 'amount';

  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
