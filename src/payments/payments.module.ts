import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { RazorpayService } from './services/implementation/razorpay.service';

@Module({
  controllers: [PaymentsController],
  providers: [RazorpayService],
})
export class PaymentModule {}
