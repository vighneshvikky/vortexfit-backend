import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainerDashboardController } from './controller/trainerDashboard.controller';
import { TrainerDashboardRepository } from './repository/trainerDashboard.repository';
import { TrainerDashboardService } from './service/trainerDashboard.service';
import { BookingModule } from 'src/booking/booking.module';
import { TransactionModule } from 'src/transactions/transaction.module';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { IADMINSERVICEDASHBOARD } from 'src/admin/adminDashboard/service/interface/IAdminDashboard.service.interface';
import { AdminDashboardService } from 'src/admin/adminDashboard/service/adminDashboard.service';
import { IADMINDASHBOARDREPOSITORY } from 'src/admin/adminDashboard/repository/inteface/IAdminDashboard.repository.interface';
import { AdminDashboardRepository } from 'src/admin/adminDashboard/repository/adminDashboard.repository';
import { ITRAINERDASHBOARDSERVICE } from './service/interface/ITrainerDashboard.service.interface';
import { ITRAINERDASHBOARDREPOSITORY } from './repository/interface/ITrainerDashboard.repository.interface';

@Module({
  imports: [
    BookingModule,
    TransactionModule,
    JwtModule.register({}),
    SubscriptionModule,
  ],
  controllers: [TrainerDashboardController],
  providers: [
    
    {
      provide: ITRAINERDASHBOARDSERVICE,
      useClass: TrainerDashboardService,
    },
    {
      provide: ITRAINERDASHBOARDREPOSITORY,
      useClass: TrainerDashboardRepository,
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [],
})
export class TrainerDashboardModule {}
