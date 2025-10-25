import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ISchedulingService } from '../interface/scheduling.interface';
import { IScheduleRepository } from '../../repositories/interface/scheduling.repository.interface';
import { CreateScheduleDto } from '../../dtos/scheduling.dto';
import { SchedulingRule } from '../../schemas/schedule.schema';
import { Types } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { ScheduleMapper } from '../../mapper/implementation/schedule.mapper';
import { ScheduleDto } from '../../mapper/interface/schedule.mapper.interface';
import dayjs from 'dayjs';
import { IBookingRepository } from 'src/booking/repository/interface/booking-repository.interface';
import {
  ISubscriptionService,
  ISUBSCRIPTIONSERVICE,
} from '@/subscription/service/interface/ISubscription.service';

export class SlotDto {
  time: string;
  isBooked: boolean;
  isAvailable: boolean;
}

@Injectable()
export class ScheduleService implements ISchedulingService {
  constructor(
    @Inject(IScheduleRepository)
    private readonly _scheduleRepository: IScheduleRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    @Inject(IBookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    @Inject(ISUBSCRIPTIONSERVICE)
    private readonly _subscriptionService: ISubscriptionService,
  ) {}

  async createSchedule(
    data: CreateScheduleDto,
    id: string,
  ): Promise<ScheduleDto> {
    const objectId = new Types.ObjectId(id);
    this.logger.log(`Creating schedule for trainerId: ${id}`);

    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    if (startMinutes >= endMinutes) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new BadRequestException('startDate must be today or a future date');
    }
    if (startDate > endDate) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate',
      );
    }

    if (!Number.isInteger(data.slotDuration) || data.slotDuration <= 0) {
      throw new BadRequestException('slotDuration must be a positive integer');
    }
    if (data.bufferTime < 0) {
      throw new BadRequestException('bufferTime must be non-negative');
    }
    if (data.bufferTime > data.slotDuration) {
      throw new BadRequestException(
        'bufferTime should not exceed slotDuration',
      );
    }
    if (endMinutes - startMinutes < data.slotDuration + data.bufferTime) {
      throw new BadRequestException(
        'Total slot time must fit in the working hours',
      );
    }

    if (data.exceptionalDays) {
      for (const day of data.exceptionalDays) {
        const exDay = new Date(day);
        if (exDay < startDate || exDay > endDate) {
          throw new BadRequestException(
            'All exceptionalDays must be between startDate and endDate',
          );
        }
      }
    }

    const existingRules = await this._scheduleRepository.findByTrainerId(
      objectId.toString(),
    );

    if (existingRules) this.validateScheduleRule(data, existingRules);

    const schedule = await this._scheduleRepository.create({
      ...data,
      trainerId: objectId,
    });

    return ScheduleMapper.toDto(schedule);
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return this._scheduleRepository.delete(id);
  }

  async getSchedulesOfTrainer(id: string): Promise<ScheduleDto[] | null> {
    const hasActiveSub =
      await this._subscriptionService.hasActiveSubscription(id);

    if (hasActiveSub) {
      throw new BadRequestException(
        'No active subscription found. Please activate a plan to access your schedule.',
      );
    }
    const data = await this._scheduleRepository.findByTrainerId(id);
    if (!data || data.length === 0) {
      return null;
    }
    return ScheduleMapper.toDtoArray(data);
  }

  async getAvailableSlots(trainerId: string, dateStr: string) {
    const date = dayjs(dateStr, 'YYYY-MM-DD', true);
    if (!date.isValid()) {
      throw new BadRequestException('Invalid date format, expected YYYY-MM-DD');
    }
    if (date.isBefore(dayjs(), 'day')) {
      throw new BadRequestException('Date cannot be in the past');
    }

    const rules = await this._scheduleRepository.findActiveRules(
      trainerId,
      dateStr,
    );

    if (!rules || rules.length === 0) {
      throw new BadRequestException(
        'No scheduling rules found for this trainer',
      );
    }
    const dayOfWeek = date.day();

    const availableSlots: string[] = [];

    for (const rule of rules) {
      if (!rule.daysOfWeek.includes(dayOfWeek)) continue;
      if (rule.exceptionalDays?.includes(dateStr)) continue;

      let start = dayjs(`${dateStr} ${rule.startTime}`, 'YYYY-MM-DD HH:mm');
      const end = dayjs(`${dateStr} ${rule.endTime}`, 'YYYY-MM-DD HH:mm');

      const now = dayjs(); // current date and time

      while (start.add(rule.slotDuration, 'minute').isBefore(end)) {
        const slotStart = start.format('HH:mm');
        const slotEnd = start.add(rule.slotDuration, 'minute').format('HH:mm');

        // Skip slots that are in the past
        if (date.isSame(now, 'day') && start.isBefore(now)) {
          start = start.add(rule.slotDuration + rule.bufferTime, 'minute');
          continue;
        }

        const existingBookings =
          await this._bookingRepository.countActiveBookings(
            trainerId,
            dateStr,
            slotStart,
            slotEnd,
          );

        if (
          !rule.maxBookingsPerSlot ||
          existingBookings < rule.maxBookingsPerSlot
        ) {
          availableSlots.push(`${slotStart}-${slotEnd}`);
        }

        start = start.add(rule.slotDuration + rule.bufferTime, 'minute');
      }

      while (start.add(rule.slotDuration, 'minute').isBefore(end)) {
        const slotStart = start.format('HH:mm');
        const slotEnd = start.add(rule.slotDuration, 'minute').format('HH:mm');

        const existingBookings =
          await this._bookingRepository.countActiveBookings(
            trainerId,
            dateStr,
            slotStart,
            slotEnd,
          );

        if (
          rule.maxBookingsPerSlot &&
          existingBookings >= rule.maxBookingsPerSlot
        ) {
          console.log('hai');
        } else {
          availableSlots.push(`${slotStart}-${slotEnd}`);
        }

        start = start.add(rule.slotDuration + rule.bufferTime, 'minute');
      }
    }

    if (availableSlots.length === 0) {
      return {
        success: false,
        message: 'No available slots for this date',
      };
    }

    return {
      success: true,
      slots: availableSlots,
    };
  }

  private validateScheduleRule(
    data: Partial<SchedulingRule>,
    existingRules: SchedulingRule[] = [],
    currentRuleId?: string,
  ) {
    const {
      startTime,
      endTime,
      startDate,
      endDate,
      bufferTime = 0,
      daysOfWeek = [],
    } = data;

    for (const rule of existingRules) {
      if (currentRuleId && rule._id.toString() === currentRuleId) continue;

      const ruleStart = new Date(rule.startDate);
      const ruleEnd = new Date(rule.endDate);
      const newStart = new Date(startDate || rule.startDate);
      const newEnd = new Date(endDate || rule.endDate);

      if (ruleStart <= newEnd && newStart <= ruleEnd) {
        const daysOverlap = rule.daysOfWeek.some((d: number) =>
          daysOfWeek.includes(d),
        );
        if (daysOverlap) {
          const [ruleStartHour, ruleStartMinute] = rule.startTime
            .split(':')
            .map(Number);
          const [ruleEndHour, ruleEndMinute] = rule.endTime
            .split(':')
            .map(Number);
          const ruleStartMin = ruleStartHour * 60 + ruleStartMinute;
          const ruleEndMin =
            ruleEndHour * 60 + ruleEndMinute + (rule.bufferTime || 0);

          const [newStartHour, newStartMinute] = (startTime || rule.startTime)
            .split(':')
            .map(Number);
          const [newEndHour, newEndMinute] = (endTime || rule.endTime)
            .split(':')
            .map(Number);
          const newStartMin = newStartHour * 60 + newStartMinute;
          const newEndMin = newEndHour * 60 + newEndMinute + (bufferTime || 0);

          if (ruleStartMin < newEndMin && newStartMin < ruleEndMin) {
            throw new BadRequestException(
              'Schedule overlaps with existing rule',
            );
          }
        }
      }
    }

    if (
      data.maxBookingsPerSlot != null &&
      (!Number.isInteger(data.maxBookingsPerSlot) ||
        data.maxBookingsPerSlot < 1)
    ) {
      throw new BadRequestException('Invalid maxBookingsPerSlot');
    }
  }
}
