import { BookingModel } from 'src/booking/models/booking.model';
import { Transaction } from 'src/transactions/schema/transaction.schema';

export const IADMINSERVICEDASHBOARD = Symbol('IADMINSERVICEDASHBOARD');

export interface DashboardStats {
  users: {
    total: number;
    newThisMonth: number;
  };
  trainers: {
    total: number;
  };
  bookings: {
    total: number;
  };
  subscriptions: {
    total: number;
  };
  revenue: {
    total: number;
    monthly: number;
  };
}

export interface RevenueBySource {
  total: number;
  count: number;
  source: string;
}

export interface MonthlyRevenueTrend {
  total: number;
  count: number;
  month: string;
}

export interface RevenueByPlan {
  total: number;
  count: number;
  planName: string;
}

export interface RevenueAnalytics {
  bySource: RevenueBySource[];
  monthlyTrend: MonthlyRevenueTrend[];
  byPlan: RevenueByPlan[];
}

export interface BookingsByStatus {
  count: number;
  status: string;
}

export interface TopTrainer {
  bookingCount: number;
  totalRevenue: number;
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
}

export interface BookingAnalytics {
  byStatus: BookingsByStatus[];
  topTrainers: TopTrainer[];
  recent: (BookingModel | null)[];
}

export interface SubscriptionByPlan {
  count: number;
  planName: string;
}

export interface SubscriptionByStatus {
  count: number;
  status: string;
}

export interface ActiveVsExpiredSubscription {
  count: number;
  status: string;
}

export interface SubscriptionAnalytics {
  byPlan: SubscriptionByPlan[];
  byStatus: SubscriptionByStatus[];
  activeVsExpired: ActiveVsExpiredSubscription[];
}

export interface UserByFitnessGoal {
  count: number;
  goal: string;
}

export interface UserByFitnessLevel {
  count: number;
  level: string | null;
}

export interface UserAnalytics {
  total: number;
  newThisMonth: number;
  byFitnessGoals: UserByFitnessGoal[];
  byFitnessLevel: UserByFitnessLevel[];
}

export interface IAdminDashboardService {
  getDashboardStats(): Promise<DashboardStats>;
  getRevenueAnalytics(): Promise<RevenueAnalytics>;
  getTotalRevenue(): Promise<number>;
  getMonthlyRevenue(): Promise<number>;

  getBookingAnalytics(): Promise<BookingAnalytics>;
  getTopTrainers(limit?: number): Promise<TopTrainer[]>;
  getRecentBookings(limit?: number): Promise<(BookingModel | null)[]>;

  getSubscriptionAnalytics(): Promise<SubscriptionAnalytics>;
  getUserAnalytics(): Promise<UserAnalytics>;

  getRecentTransactions(limit?: number): Promise<Transaction[]>;

  getUserCount(): Promise<number>;
  getTrainerCount(): Promise<number>;
  getBookingCount(): Promise<number>;
  getSubscriptionCount(): Promise<number>;
}
