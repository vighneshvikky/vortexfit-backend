import { Module } from '@nestjs/common';
import { UserDashboardController } from './controller/userDashboard.controller';
import { UserDashboardService } from './service/userDashboard.service';
import { UserDashboardRepository } from './repository/userDashboard.repository';
import { BookingModule } from 'src/booking/booking.module';
import { TransactionModule } from 'src/transactions/transaction.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { UserModule } from '../user.module';
import { JwtModule } from '@nestjs/jwt';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';
import { IUSERDASHBOARDSERVICE } from './service/interface/IUserDashboard.service.interface';
import { IUSERDASHBOARDREPOSITORY } from './repository/interface/IUserDashboard.repository.interface';

@Module({
  imports: [
    BookingModule,
    TransactionModule,
    WalletModule,
    SubscriptionModule,
    UserModule,
    JwtModule.register({}),
  ],
  controllers: [UserDashboardController],
  providers: [
    {
      provide: IUSERDASHBOARDSERVICE,
      useClass: UserDashboardService,
    },
    {
      provide: IUSERDASHBOARDREPOSITORY,
      useClass: UserDashboardRepository,
    },
    {
      provide: IJwtTokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [],
})
export class UserDashboardModule {}
