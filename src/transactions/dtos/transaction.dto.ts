import { IsEnum, IsMongoId, IsNumber, IsOptional } from 'class-validator';
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
  fromDate?: Date;

  @IsOptional()
  toDate?: Date;

  @IsOptional()
  @IsEnum(['BOOKING', 'SUBSCRIPTION'])
  sourceType?: 'BOOKING' | 'SUBSCRIPTION';
}
