import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import {
  IUserDashboardService,
  IUSERDASHBOARDSERVICE,
} from '../service/interface/IUserDashboard.service.interface';

@Controller('user-dashboard')
@UseGuards(JwtAuthGuard)
export class UserDashboardController {
  constructor(
    @Inject(IUSERDASHBOARDSERVICE)
    private readonly _userDashboardService: IUserDashboardService,
  ) {}

  @Get('stats')
  async getDashboardStats(@GetUser('sub') userId: string) {
    return this._userDashboardService.getDashboardStats(userId);
  }

  @Get('subscription')
  async getActiveSubscription(@GetUser('sub') userId: string) {
    return this._userDashboardService.getActiveSubscription(userId);
  }

  @Get('bookings')
  async getRecentBookings(@GetUser('sub') userId: string) {
    return this._userDashboardService.getRecentBookings(userId);
  }

  @Get('transactions')
  async getRecentTransactions(@GetUser('sub') userId: string) {
    return this._userDashboardService.getRecentTransactions(userId);
  }

  @Get('wallet')
  async getWalletBalance(@GetUser('sub') userId: string) {
    return this._userDashboardService.getWalletBalance(userId);
  }

  @Get('spending-summary')
  async getSpendingSummary(@GetUser('sub') userId: string) {
    return this._userDashboardService.getSpendingSummary(userId);
  }
}
