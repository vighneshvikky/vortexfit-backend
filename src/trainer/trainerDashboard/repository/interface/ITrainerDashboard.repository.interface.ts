import { Types } from 'mongoose';
import { Booking } from 'src/booking/schemas/booking.schema';

export const ITRAINERDASHBOARDREPOSITORY = Symbol(
  'ITRAINERDASHBOARDREPOSITORY',
);

export interface ITrainerDashboardRepository {
  getTotalBookings(trainerId: Types.ObjectId): Promise<number>;
  getTotalRevenue(trainerId: Types.ObjectId): Promise<number>;
  getActiveSubscriptions(trainerId: Types.ObjectId): Promise<number>;
  getPendingBookings(trainerId: Types.ObjectId): Promise<number>;
  getRevenueBreakdown(trainerId: Types.ObjectId): Promise<
    {
      type: string;
      total: number;
      count: number;
    }[]
  >;
  getRecentBookings(
    trainerId: Types.ObjectId,
    limit?: number,
  ): Promise<Booking[]>;
  getBookingStatusBreakdown(trainerId: Types.ObjectId): Promise<
    {
      status: string;
      count: number;
    }[]
  >;
  getMonthlyRevenue(trainerId: Types.ObjectId): Promise<
    {
      month: string;
      revenue: number;
    }[]
  >;
}
