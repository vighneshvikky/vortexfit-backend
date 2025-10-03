import { Controller, Get, UseGuards, Req, Inject } from '@nestjs/common';
import { Roles } from 'src/common/decorator/role.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ITRAINERDASHBOARDSERVICE, ITrainerDashboardService } from '../service/interface/ITrainerDashboard.service.interface';

@Controller('trainer/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('trainer')
export class TrainerDashboardController {
  constructor(
   @Inject(ITRAINERDASHBOARDSERVICE)  private readonly _trainerDashboardService: ITrainerDashboardService,
  ) {}

  @Get('stats')
  async getDashboardStats(@GetUser('sub') trainerId: string) {
    return this._trainerDashboardService.getDashboardStats(trainerId);
  }

  @Get('revenue')
  async getRevenueData(@GetUser('sub') trainerId: string) {
    return this._trainerDashboardService.getRevenueData(trainerId);
  }

  @Get('bookings/recent')
  async getRecentBookings(@GetUser('sub') trainerId: string) {
    return this._trainerDashboardService.getRecentBookings(trainerId);
  }

  @Get('bookings/status-breakdown')
  async getBookingStatusBreakdown(@GetUser('sub') trainerId: string) {
    return this._trainerDashboardService.getBookingStatusBreakdown(trainerId);
  }

  @Get('revenue/monthly')
  async getMonthlyRevenue(@GetUser('sub') trainerId: string) {
    return this._trainerDashboardService.getMonthlyRevenue(trainerId);
  }
}
