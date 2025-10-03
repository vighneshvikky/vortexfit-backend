import { Module } from '@nestjs/common';
import { AdminDashboardController } from './controller/adminDashboard.controller';
import { AdminDashboardRepository } from './repository/adminDashboard.repository';
import { AdminDashboardService } from './service/adminDashboard.service';
import { UserModule } from 'src/user/user.module';
import { TrainerModule } from 'src/trainer/trainer.module';
import { planModule } from 'src/plans/plan.module';
import { BookingModule } from 'src/booking/booking.module';
import { TransactionModule } from 'src/transactions/transaction.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { JwtModule } from '@nestjs/jwt';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { IADMINSERVICEDASHBOARD } from './service/interface/IAdminDashboard.service.interface';
import { IADMINDASHBOARDREPOSITORY } from './repository/inteface/IAdminDashboard.repository.interface';

@Module({
  imports: [
    UserModule,
    TrainerModule,
    planModule,
    BookingModule,
    TransactionModule,
    SubscriptionModule,
    JwtModule.register({}),
  ],
  controllers: [AdminDashboardController],
  providers: [
    {
      useClass: AdminDashboardService,
      provide: IADMINSERVICEDASHBOARD,
    },
        {
      useClass: AdminDashboardRepository,
      provide: IADMINDASHBOARDREPOSITORY,
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [],
})
export class AdminDashboardModule {}
