// import { Types } from 'mongoose';
// import { IAvailabilityTemplate, ITimeSlot } from '../schemas';
// import { CreateAvailabilityDto, UpdateAvailabilityDto, CreateSpecificSlotDto } from '../dto';

// export interface IAvailabilityRepository {
//   // Availability Templates
//   createAvailability(trainerId: string, data: CreateAvailabilityDto): Promise<IAvailabilityTemplate>;
//   findAvailabilityByTrainer(trainerId: string): Promise<IAvailabilityTemplate[]>;
//   findAvailabilityById(id: string): Promise<IAvailabilityTemplate | null>;
//   updateAvailability(id: string, data: UpdateAvailabilityDto): Promise<IAvailabilityTemplate | null>;
//   deleteAvailability(id: string): Promise<boolean>;

//   // Time Slots
//   createSpecificSlot(trainerId: string, data: CreateSpecificSlotDto): Promise<ITimeSlot>;
//   generateSlotsFromTemplate(trainerId: string, templateId: string, startDate: Date, endDate: Date): Promise<ITimeSlot[]>;
//   findSlotsByTrainerAndDateRange(trainerId: string, startDate: Date, endDate: Date): Promise<ITimeSlot[]>;
//   updateSlot(id: string, data: Partial<ITimeSlot>): Promise<ITimeSlot | null>;
//   deleteSlot(id: string): Promise<boolean>;
//   blockSlot(id: string): Promise<ITimeSlot | null>;
//   unblockSlot(id: string): Promise<ITimeSlot | null>;
// }
