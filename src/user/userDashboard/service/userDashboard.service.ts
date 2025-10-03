import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingMapper } from 'src/booking/mapper/booking.mapper';
import { IUserDashboardService } from './interface/IUserDashboard.service.interface';
import { mapTransactionToDto } from 'src/transactions/mapper/transaction.mapper';
import { IUserDashboardRepository, IUSERDASHBOARDREPOSITORY } from '../repository/interface/IUserDashboard.repository.interface';

@Injectable()
export class UserDashboardService implements IUserDashboardService{
  constructor(
   @Inject(IUSERDASHBOARDREPOSITORY)  private readonly _userDashboardRepository: IUserDashboardRepository,
  ) {}

  async getDashboardStats(userId: string) {
    const objectId = new Types.ObjectId(userId);

    const [
      totalBookings,
      upcomingBookings,
      completedBookings,
      activeSubscription,
      wallet,
      totalSpent,
    ] = await Promise.all([
      this._userDashboardRepository.getTotalBookingsCount(objectId),
      this._userDashboardRepository.getUpcomingBookingsCount(objectId),
      this._userDashboardRepository.getCompletedBookingsCount(objectId),
      this._userDashboardRepository.getActiveSubscription(objectId),
      this._userDashboardRepository.getWalletBalance(objectId),
      this._userDashboardRepository.getTotalSpent(objectId),
    ]);

    return {
      totalBookings,
      upcomingBookings,
      completedBookings,
      hasActiveSubscription: !!activeSubscription,
    //   subscriptionName: activeSubscription?.planId?.name || null,
      walletBalance: wallet?.balance || 0,
      totalSpent: totalSpent || 0,
    };
  }

  async getActiveSubscription(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const subscription = await this._userDashboardRepository.getActiveSubscription(objectId);
    
    if (!subscription) {
      return null;
    }

    return {
    //   planName: subscription.planId?.name,
      price: subscription.price,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
      daysRemaining: Math.ceil(
        (new Date(subscription.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    };
  }

  async getRecentBookings(userId: string, limit: number = 5) {
    const objectId = new Types.ObjectId(userId);
    let recentBookings = await this._userDashboardRepository.getRecentBookings(objectId, limit);

    let bookings = recentBookings.map(b => BookingMapper.toDomain(b));

    return bookings
  }

  async getRecentTransactions(userId: string, limit: number = 10) {
    const objectId = new Types.ObjectId(userId);
    const transactions = await this._userDashboardRepository.getRecentTransactions(objectId, limit);

    return transactions.map(mapTransactionToDto)
  }

  async getWalletBalance(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const wallet = await this._userDashboardRepository.getWalletBalance(objectId);
    return {
      balance: wallet?.balance || 0,
    };
  }

  async getSpendingSummary(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const transactions = await this._userDashboardRepository.getAllTransactions(objectId);

    let bookingSpent = 0;
    let subscriptionSpent = 0;

    transactions.forEach((transaction) => {
      if (transaction.sourceType === 'BOOKING') {
        bookingSpent += transaction.amount;
      } else if (transaction.sourceType === 'SUBSCRIPTION') {
        subscriptionSpent += transaction.amount;
      }
    });

    return {
      bookingSpent,
      subscriptionSpent,
      totalSpent: bookingSpent + subscriptionSpent,
    };
  }
}