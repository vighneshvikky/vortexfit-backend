import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  trainerId: string;

  @IsNumber()
  amount: number;

  @IsString()
  sessionType: string;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;
}

export class VerifyPaymentDto {
  @IsString()
  razorpay_payment_id: string;

  @IsString()
  razorpay_order_id: string;

  @IsString()
  razorpay_signature: string;

  @IsString()
  trainerId: string;

  @IsString()
  sessionType: string;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;

  @IsNumber()
  amount: number;
}
