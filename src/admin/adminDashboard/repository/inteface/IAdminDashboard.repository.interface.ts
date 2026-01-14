import { Booking } from 'src/booking/schemas/booking.schema';
import { TransactionDocument } from 'src/transactions/schema/transaction.schema';

export const IADMINDASHBOARDREPOSITORY = Symbol('IADMINDASHBOARDREPOSITORY');

export interface RevenueBySourceResult {
  source: string;
  total: number;
  count: number;
}

export interface MonthlyRevenueBreakdownResult {
  month: string;
  total: number;
  count: number;
}

export interface RevenueByPlanResult {
  planName: string;
  total: number;
  count: number;
}

export interface BookingsByStatusResult {
  status: string;
  count: number;
}

export interface TopTrainerResult {
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  bookingCount: number;
  totalRevenue: number;
}

export interface SubscriptionByPlanResult {
  planName: string;
  count: number;
}

export interface SubscriptionByStatusResult {
  status: string;
  count: number;
}

export interface ActiveVsExpiredResult {
  status: string;
  count: number;
}

export interface UserByFitnessGoalResult {
  goal: string;
  count: number;
}

export interface UserByFitnessLevelResult {
  level: string | null;
  count: number;
}

export interface IAdminDashboardRepository {
  countUsers(): Promise<number>;
  countTrainers(): Promise<number>;
  countBookings(): Promise<number>;
  countSubscriptions(): Promise<number>;

  getTotalRevenue(): Promise<number>;
  getMonthlyRevenue(): Promise<number>;
  getRevenueBySource(): Promise<RevenueBySourceResult[]>;
  getMonthlyRevenueBreakdown(): Promise<MonthlyRevenueBreakdownResult[]>;
  getRevenueByPlan(): Promise<RevenueByPlanResult[]>;

  getBookingsByStatus(): Promise<BookingsByStatusResult[]>;
  getTopTrainersByBookings(limit?: number): Promise<TopTrainerResult[]>;
  getRecentBookings(limit?: number): Promise<Booking[]>;

  getSubscriptionsByPlan(): Promise<SubscriptionByPlanResult[]>;
  getSubscriptionsByStatus(): Promise<SubscriptionByStatusResult[]>;
  getActiveVsExpiredSubscriptions(): Promise<ActiveVsExpiredResult[]>;

  getUsersByFitnessGoals(): Promise<UserByFitnessGoalResult[]>;
  getUsersByFitnessLevel(): Promise<UserByFitnessLevelResult[]>;
  getNewUsersThisMonth(): Promise<number>;

  getRecentTransactions(limit?: number): Promise<TransactionDocument[]>;
}
