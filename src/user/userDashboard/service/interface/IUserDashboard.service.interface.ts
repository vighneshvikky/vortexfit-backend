import { BookingModel } from 'src/booking/models/booking.model';
import { TransactionDto } from 'src/transactions/mapper/transaction.mapper';

export const IUSERDASHBOARDSERVICE = Symbol('IUSERDASHBOARDSERVICE');

export interface IUserDashboardService {
  getDashboardStats(userId: string): Promise<{
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    hasActiveSubscription: boolean;
    walletBalance: number;
    totalSpent: number;
  }>;

  getActiveSubscription(userId: string): Promise<{
    price: number;
    startDate: Date;
    endDate: Date;
    status: string;
    daysRemaining: number;
  } | null>;

  getRecentBookings(
    userId: string,
    limit?: number,
  ): Promise<(BookingModel | null)[]>;

  getRecentTransactions(
    userId: string,
    limit?: number,
  ): Promise<TransactionDto[]>;

  getWalletBalance(userId: string): Promise<{
    balance: number;
  }>;

  getSpendingSummary(userId: string): Promise<{
    bookingSpent: number;
    subscriptionSpent: number;
    totalSpent: number;
  }>;
}
