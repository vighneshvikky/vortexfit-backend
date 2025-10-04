import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingMapper } from 'src/booking/mapper/booking.mapper';
import { ITrainerDashboardService } from './interface/ITrainerDashboard.service.interface';
import {
  ITrainerDashboardRepository,
  ITRAINERDASHBOARDREPOSITORY,
} from '../repository/interface/ITrainerDashboard.repository.interface';

@Injectable()
export class TrainerDashboardService implements ITrainerDashboardService {
  constructor(
    @Inject(ITRAINERDASHBOARDREPOSITORY)
    private readonly _trainerDashboardRepository: ITrainerDashboardRepository,
  ) {}

  async getDashboardStats(trainerId: string) {
    const trainerObjectId = new Types.ObjectId(trainerId);

    const [totalBookings, totalRevenue, activeSubscriptions, pendingBookings] =
      await Promise.all([
        this._trainerDashboardRepository.getTotalBookings(trainerObjectId),
        this._trainerDashboardRepository.getTotalRevenue(trainerObjectId),
        this._trainerDashboardRepository.getActiveSubscriptions(
          trainerObjectId,
        ),
        this._trainerDashboardRepository.getPendingBookings(trainerObjectId),
      ]);

    return {
      totalBookings,
      totalRevenue,
      activeSubscriptions,
      pendingBookings,
    };
  }

  async getRevenueData(trainerId: string) {
    const trainerObjectId = new Types.ObjectId(trainerId);
    return this._trainerDashboardRepository.getRevenueBreakdown(
      trainerObjectId,
    );
  }

  async getRecentBookings(trainerId: string) {
    const trainerObjectId = new Types.ObjectId(trainerId);
    const recentBookings =
      await this._trainerDashboardRepository.getRecentBookings(
        trainerObjectId,
        5,
      );

    const bookings = recentBookings.map((b) => BookingMapper.toDomain(b));
    return bookings;
  }

  async getBookingStatusBreakdown(trainerId: string) {
    const trainerObjectId = new Types.ObjectId(trainerId);
    return this._trainerDashboardRepository.getBookingStatusBreakdown(
      trainerObjectId,
    );
  }

  async getMonthlyRevenue(trainerId: string) {
    const trainerObjectId = new Types.ObjectId(trainerId);
    return this._trainerDashboardRepository.getMonthlyRevenue(trainerObjectId);
  }
}
