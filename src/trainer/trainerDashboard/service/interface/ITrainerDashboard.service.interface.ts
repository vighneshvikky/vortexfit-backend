import { BookingModel } from "src/booking/models/booking.model";

export const ITRAINERDASHBOARDSERVICE = Symbol('ITRAINERDASHBOARDSERVICE')

export interface ITrainerDashboardService {
  getDashboardStats(trainerId: string): Promise<{
    totalBookings: number;
    totalRevenue: number;
    activeSubscriptions: number;
    pendingBookings: number;
  }>;

   

  getRevenueData(trainerId: string): Promise<
    {
      type: string;
      total: number;
      count: number;
    }[]
  >;

  getRecentBookings(trainerId: string): Promise<(BookingModel | null)[]>; 

  getBookingStatusBreakdown(trainerId: string): Promise<
    {
      status: string;
      count: number;
    }[]
  >;

  getMonthlyRevenue(trainerId: string): Promise<
    {
      month: string;
      revenue: number;
    }[]
  >;
}
