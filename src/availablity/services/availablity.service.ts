// // ==================== SERVICE ====================
// // src/modules/availability/services/availability.service.ts
// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   ForbiddenException,
// } from '@nestjs/common';
// // import { IAvailabilityService } from '../interfaces/availability-service.interface';
// import { IAvailabilityService } from '../interface/availability-service.interface';
// // import { IAvailabilityRepository } from '../interfaces/availability-repository.interface';
// import { IAvailabilityRepository } from '../interface/availability-repository.interface';
// // import { IAvailabilityTemplate, ITimeSlot } from '../schemas';
// import { AvailabilityTemplate } from '../schemas/availablity.schema';
// import {
//   CreateAvailabilityDto,
//   UpdateAvailabilityDto,
//   CreateSpecificSlotDto,
// } from '';

// @Injectable()
// export class AvailabilityService implements IAvailabilityService {
//   constructor(
//     private readonly availabilityRepository: IAvailabilityRepository,
//   ) {}

//   async createAvailabilityTemplate(
//     trainerId: string,
//     data: CreateAvailabilityDto,
//   ): Promise<AvailabilityTemplate> {
//     // Validate time format and logic
//     this.validateTimeRange(data.startTime, data.endTime);

//     // Check for existing template for same day
//     const existingTemplates =
//       await this.availabilityRepository.findAvailabilityByTrainer(trainerId);
//     const duplicateDay = existingTemplates.find(
//       (template) => template.dayOfWeek === data.dayOfWeek && template.isActive,
//     );

//     if (duplicateDay) {
//       throw new BadRequestException(
//         `Availability template already exists for this day of week`,
//       );
//     }

//     return await this.availabilityRepository.createAvailability(
//       trainerId,
//       data,
//     );
//   }

//   async getTrainerAvailability(
//     trainerId: string,
//   ): Promise<AvailabilityTemplate[]> {
//     return await this.availabilityRepository.findAvailabilityByTrainer(
//       trainerId,
//     );
//   }

//   async updateAvailabilityTemplate(
//     trainerId: string,
//     templateId: string,
//     data: UpdateAvailabilityDto,
//   ): Promise<AvailabilityTemplate> {
//     const template =
//       await this.availabilityRepository.findAvailabilityById(templateId);

//     if (!template) {
//       throw new NotFoundException('Availability template not found');
//     }

//     if (template.trainerId.toString() !== trainerId) {
//       throw new ForbiddenException('Not authorized to update this template');
//     }

//     if (data.startTime && data.endTime) {
//       this.validateTimeRange(data.startTime, data.endTime);
//     }

//     const updatedTemplate =
//       await this.availabilityRepository.updateAvailability(templateId, data);

//     if (!updatedTemplate) {
//       throw new NotFoundException('Failed to update availability template');
//     }

//     return updatedTemplate;
//   }

//   async deleteAvailabilityTemplate(
//     trainerId: string,
//     templateId: string,
//   ): Promise<void> {
//     const template =
//       await this.availabilityRepository.findAvailabilityById(templateId);

//     if (!template) {
//       throw new NotFoundException('Availability template not found');
//     }

//     if (template.trainerId.toString() !== trainerId) {
//       throw new ForbiddenException('Not authorized to delete this template');
//     }

//     const deleted =
//       await this.availabilityRepository.deleteAvailability(templateId);

//     if (!deleted) {
//       throw new BadRequestException('Failed to delete availability template');
//     }
//   }

//   async createSpecificSlot(
//     trainerId: string,
//     data: CreateSpecificSlotDto,
//   ): Promise<ITimeSlot> {
//     // Validate slot times
//     if (data.startTime >= data.endTime) {
//       throw new BadRequestException('Start time must be before end time');
//     }

//     // Check for overlapping slots
//     const existingSlots =
//       await this.availabilityRepository.findSlotsByTrainerAndDateRange(
//         trainerId,
//         data.date,
//         data.date,
//       );

//     const hasOverlap = existingSlots.some(
//       (slot) => data.startTime < slot.endTime && data.endTime > slot.startTime,
//     );

//     if (hasOverlap) {
//       throw new BadRequestException('Time slot overlaps with existing slot');
//     }

//     return await this.availabilityRepository.createSpecificSlot(
//       trainerId,
//       data,
//     );
//   }

//   async generateSlots(
//     trainerId: string,
//     startDate: Date,
//     endDate: Date,
//   ): Promise<ITimeSlot[]> {
//     if (startDate >= endDate) {
//       throw new BadRequestException('Start date must be before end date');
//     }

//     const templates =
//       await this.availabilityRepository.findAvailabilityByTrainer(trainerId);
//     const activeTemplates = templates.filter((template) => template.isActive);

//     if (activeTemplates.length === 0) {
//       throw new BadRequestException('No active availability templates found');
//     }

//     const allSlots: ITimeSlot[] = [];

//     for (const template of activeTemplates) {
//       const slots = await this.availabilityRepository.generateSlotsFromTemplate(
//         trainerId,
//         template._id.toString(),
//         startDate,
//         endDate,
//       );
//       allSlots.push(...slots);
//     }

//     return allSlots;
//   }

//   async getTrainerSlots(
//     trainerId: string,
//     startDate: Date,
//     endDate: Date,
//   ): Promise<ITimeSlot[]> {
//     return await this.availabilityRepository.findSlotsByTrainerAndDateRange(
//       trainerId,
//       startDate,
//       endDate,
//     );
//   }

//   async blockTimeSlot(trainerId: string, slotId: string): Promise<ITimeSlot> {
//     const slot = await this.timeSlotModel.findById(slotId).exec();

//     if (!slot) {
//       throw new NotFoundException('Time slot not found');
//     }

//     if (slot.trainerId.toString() !== trainerId) {
//       throw new ForbiddenException('Not authorized to block this slot');
//     }

//     if (slot.isBooked) {
//       throw new BadRequestException('Cannot block a booked slot');
//     }

//     const blockedSlot = await this.availabilityRepository.blockSlot(slotId);

//     if (!blockedSlot) {
//       throw new BadRequestException('Failed to block slot');
//     }

//     return blockedSlot;
//   }

//   async unblockTimeSlot(trainerId: string, slotId: string): Promise<ITimeSlot> {
//     const slot = await this.timeSlotModel.findById(slotId).exec();

//     if (!slot) {
//       throw new NotFoundException('Time slot not found');
//     }

//     if (slot.trainerId.toString() !== trainerId) {
//       throw new ForbiddenException('Not authorized to unblock this slot');
//     }

//     const unblockedSlot = await this.availabilityRepository.unblockSlot(slotId);

//     if (!unblockedSlot) {
//       throw new BadRequestException('Failed to unblock slot');
//     }

//     return unblockedSlot;
//   }

//   private validateTimeRange(startTime: string, endTime: string): void {
//     const start = this.timeStringToMinutes(startTime);
//     const end = this.timeStringToMinutes(endTime);

//     if (start >= end) {
//       throw new BadRequestException('Start time must be before end time');
//     }

//     if (end - start < 15) {
//       throw new BadRequestException('Time range must be at least 15 minutes');
//     }
//   }

//   private timeStringToMinutes(timeString: string): number {
//     const [hours, minutes] = timeString.split(':').map(Number);
//     return hours * 60 + minutes;
//   }
// }
