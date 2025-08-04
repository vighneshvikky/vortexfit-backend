// export interface IAvailabilityService {
//   createAvailabilityTemplate(trainerId: string, data: CreateAvailabilityDto): Promise<IAvailabilityTemplate>;
//   getTrainerAvailability(trainerId: string): Promise<IAvailabilityTemplate[]>;
//   updateAvailabilityTemplate(trainerId: string, templateId: string, data: UpdateAvailabilityDto): Promise<IAvailabilityTemplate>;
//   deleteAvailabilityTemplate(trainerId: string, templateId: string): Promise<void>;

//   createSpecificSlot(trainerId: string, data: CreateSpecificSlotDto): Promise<ITimeSlot>;
//   generateSlots(trainerId: string, startDate: Date, endDate: Date): Promise<ITimeSlot[]>;
//   getTrainerSlots(trainerId: string, startDate: Date, endDate: Date): Promise<ITimeSlot[]>;
//   blockTimeSlot(trainerId: string, slotId: string): Promise<ITimeSlot>;
//   unblockTimeSlot(trainerId: string, slotId: string): Promise<ITimeSlot>;
// }
