import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  IAdminDashboardService,
  IADMINSERVICEDASHBOARD,
} from '../service/interface/IAdminDashboard.service.interface';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('adminDashboard')
export class AdminDashboardController {
  constructor(
    @Inject(IADMINSERVICEDASHBOARD)
    private readonly _adminService: IAdminDashboardService,
  ) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this._adminService.getDashboardStats();
  }

  @Get('revenue')
  async getRevenueAnalytics() {
    return this._adminService.getRevenueAnalytics();
  }

  @Get('revenue/total')
  async getTotalRevenue() {
    const total = await this._adminService.getTotalRevenue();
    return { total };
  }

  @Get('revenue/monthly')
  async getMonthlyRevenue() {
    const monthly = await this._adminService.getMonthlyRevenue();
    return { monthly };
  }

  @Get('bookings/analytics')
  async getBookingAnalytics() {
    return this._adminService.getBookingAnalytics();
  }

  @Get('bookings/recent')
  async getRecentBookings(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this._adminService.getRecentBookings(limit);
  }

  @Get('bookings/count')
  async getBookingCount() {
    const count = await this._adminService.getBookingCount();
    return { count };
  }

  @Get('trainers/top')
  async getTopTrainers(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this._adminService.getTopTrainers(limit);
  }

  @Get('trainers/count')
  async getTrainerCount() {
    const count = await this._adminService.getTrainerCount();
    return { count };
  }

  @Get('subscriptions/analytics')
  async getSubscriptionAnalytics() {
    return this._adminService.getSubscriptionAnalytics();
  }

  @Get('subscriptions/count')
  async getSubscriptionCount() {
    const count = await this._adminService.getSubscriptionCount();
    return { count };
  }

  @Get('users/analytics')
  async getUserAnalytics() {
    return this._adminService.getUserAnalytics();
  }

  @Get('users/count')
  async getUserCount() {
    const count = await this._adminService.getUserCount();
    return { count };
  }

  @Get('transactions/recent')
  async getRecentTransactions(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this._adminService.getRecentTransactions(limit);
  }
}
