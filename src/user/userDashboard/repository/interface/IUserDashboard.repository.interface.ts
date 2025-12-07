import { Types } from 'mongoose';
import { BookingDocument } from 'src/booking/schemas/booking.schema';
import { SubscriptionDocument } from 'src/subscription/schema/subscription.schema';
import { TransactionDocument } from 'src/transactions/schema/transaction.schema';
import { WalletDocument } from 'src/wallet/schema/wallet.schema';

export const IUSERDASHBOARDREPOSITORY = Symbol('IUSERDASHBOARDREPOSITORY');

export interface IUserDashboardRepository {
  getTotalBookingsCount(userId: Types.ObjectId): Promise<number>;
  getUpcomingBookingsCount(userId: Types.ObjectId): Promise<number>;
  getCompletedBookingsCount(userId: Types.ObjectId): Promise<number>;

  getActiveSubscription(
    userId: Types.ObjectId,
  ): Promise<SubscriptionDocument | null>;

  getRecentBookings(
    userId: Types.ObjectId,
    limit?: number,
  ): Promise<BookingDocument[]>;

  getRecentTransactions(
    userId: Types.ObjectId,
    limit?: number,
  ): Promise<TransactionDocument[]>;

  getWalletBalance(userId: Types.ObjectId): Promise<WalletDocument | null>;

  getTotalSpent(userId: Types.ObjectId): Promise<number>;

  getAllTransactions(userId: Types.ObjectId): Promise<TransactionDocument[]>;
}
