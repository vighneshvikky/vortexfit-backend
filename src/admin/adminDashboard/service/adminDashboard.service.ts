import { Inject, Injectable } from '@nestjs/common';
import { BookingMapper } from 'src/booking/mapper/booking.mapper';
import { IAdminDashboardService } from './interface/IAdminDashboard.service.interface';
import {
  IAdminDashboardRepository,
  IADMINDASHBOARDREPOSITORY,
} from '../repository/inteface/IAdminDashboard.repository.interface';

@Injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @Inject(IADMINDASHBOARDREPOSITORY)
    private readonly _adminRepository: IAdminDashboardRepository,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalTrainers,
      totalBookings,
      totalSubscriptions,
      totalRevenue,
      monthlyRevenue,
      newUsersThisMonth,
    ] = await Promise.all([
      this._adminRepository.countUsers(),
      this._adminRepository.countTrainers(),
      this._adminRepository.countBookings(),
      this._adminRepository.countSubscriptions(),
      this._adminRepository.getTotalRevenue(),
      this._adminRepository.getMonthlyRevenue(),
      this._adminRepository.getNewUsersThisMonth(),
    ]);

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
      },
      trainers: {
        total: totalTrainers,
      },
      bookings: {
        total: totalBookings,
      },
      subscriptions: {
        total: totalSubscriptions,
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
      },
    };
  }

  async getRevenueAnalytics() {
    const [revenueBySource, monthlyBreakdown, revenueByPlan] =
      await Promise.all([
        this._adminRepository.getRevenueBySource(),
        this._adminRepository.getMonthlyRevenueBreakdown(),
        this._adminRepository.getRevenueByPlan(),
      ]);

    return {
      bySource: revenueBySource,
      monthlyTrend: monthlyBreakdown,
      byPlan: revenueByPlan,
    };
  }

  async getTotalRevenue() {
    return this._adminRepository.getTotalRevenue();
  }

  async getMonthlyRevenue() {
    return this._adminRepository.getMonthlyRevenue();
  }

  async getBookingAnalytics() {
    const [bookingsByStatus, topTrainers, recentBookings] = await Promise.all([
      this._adminRepository.getBookingsByStatus(),
      this._adminRepository.getTopTrainersByBookings(10),
      this._adminRepository.getRecentBookings(10),
    ]);

    const bookings = recentBookings.map((b) => BookingMapper.toDomain(b));

    return {
      byStatus: bookingsByStatus,
      topTrainers,
      recent: bookings,
    };
  }

  async getTopTrainers(limit = 5) {
    return this._adminRepository.getTopTrainersByBookings(limit);
  }

  async getRecentBookings(limit = 10) {
    const recentBookings = await this._adminRepository.getRecentBookings(limit);
    const bookings = recentBookings.map((b) => BookingMapper.toDomain(b));

    return bookings;
  }

  async getSubscriptionAnalytics() {
    const [byPlan, byStatus, activeVsExpired] = await Promise.all([
      this._adminRepository.getSubscriptionsByPlan(),
      this._adminRepository.getSubscriptionsByStatus(),
      this._adminRepository.getActiveVsExpiredSubscriptions(),
    ]);

    return {
      byPlan,
      byStatus,
      activeVsExpired,
    };
  }

  async getUserAnalytics() {
    const [byFitnessGoals, byFitnessLevel, totalUsers, newThisMonth] =
      await Promise.all([
        this._adminRepository.getUsersByFitnessGoals(),
        this._adminRepository.getUsersByFitnessLevel(),
        this._adminRepository.countUsers(),
        this._adminRepository.getNewUsersThisMonth(),
      ]);

    return {
      total: totalUsers,
      newThisMonth,
      byFitnessGoals,
      byFitnessLevel,
    };
  }

  async getRecentTransactions(limit = 20) {
    return this._adminRepository.getRecentTransactions(limit);
  }

  async getUserCount() {
    return this._adminRepository.countUsers();
  }

  async getTrainerCount() {
    return this._adminRepository.countTrainers();
  }

  async getBookingCount() {
    return this._adminRepository.countBookings();
  }

  async getSubscriptionCount() {
    return this._adminRepository.countSubscriptions();
  }
}
