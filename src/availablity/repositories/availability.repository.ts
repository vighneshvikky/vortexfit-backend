// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { IAvailabilityTemplate, ITimeSlot } from '../schemas';
// import { IAvailabilityRepository } from '../interfaces/availability-repository.interface';
// import { CreateAvailabilityDto, UpdateAvailabilityDto, CreateSpecificSlotDto } from '../dto';

// @Injectable()
// export class AvailabilityRepository implements IAvailabilityRepository {
//   constructor(
//     @InjectModel('AvailabilityTemplate')
//     private readonly availabilityModel: Model<IAvailabilityTemplate>,
//     @InjectModel('TimeSlot')
//     private readonly timeSlotModel: Model<ITimeSlot>,
//   ) {}

//   async createAvailability(trainerId: string, data: CreateAvailabilityDto): Promise<IAvailabilityTemplate> {
//     const availability = new this.availabilityModel({
//       trainerId: new Types.ObjectId(trainerId),
//       ...data,
//       isActive: data.isActive ?? true,
//       breakDuration: data.breakDuration ?? 15,
//     });

//     return await availability.save();
//   }

//   async findAvailabilityByTrainer(trainerId: string): Promise<IAvailabilityTemplate[]> {
//     return await this.availabilityModel
//       .find({ trainerId: new Types.ObjectId(trainerId) })
//       .sort({ dayOfWeek: 1, startTime: 1 })
//       .exec();
//   }

//   async findAvailabilityById(id: string): Promise<IAvailabilityTemplate | null> {
//     return await this.availabilityModel.findById(id).exec();
//   }

//   async updateAvailability(id: string, data: UpdateAvailabilityDto): Promise<IAvailabilityTemplate | null> {
//     return await this.availabilityModel
//       .findByIdAndUpdate(id, data, { new: true })
//       .exec();
//   }

//   async deleteAvailability(id: string): Promise<boolean> {
//     const result = await this.availabilityModel.findByIdAndDelete(id).exec();
//     return !!result;
//   }

//   async createSpecificSlot(trainerId: string, data: CreateSpecificSlotDto): Promise<ITimeSlot> {
//     const slot = new this.timeSlotModel({
//       trainerId: new Types.ObjectId(trainerId),
//       ...data,
//       isBlocked: data.isBlocked ?? false,
//     });

//     return await slot.save();
//   }

//   async generateSlotsFromTemplate(
//     trainerId: string,
//     templateId: string,
//     startDate: Date,
//     endDate: Date
//   ): Promise<ITimeSlot[]> {
//     const template = await this.availabilityModel.findById(templateId).exec();
//     if (!template) {
//       throw new Error('Availability template not found');
//     }

//     const slots: ITimeSlot[] = [];
//     const currentDate = new Date(startDate);

//     while (currentDate <= endDate) {
//       if (currentDate.getDay() === template.dayOfWeek) {
//         const generatedSlots = await this.generateSlotsForDay(trainerId, template, new Date(currentDate));
//         slots.push(...generatedSlots);
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     if (slots.length > 0) {
//       return await this.timeSlotModel.insertMany(slots);
//     }

//     return slots;
//   }

//   private async generateSlotsForDay(
//     trainerId: string,
//     template: IAvailabilityTemplate,
//     date: Date
//   ): Promise<ITimeSlot[]> {
//     const slots: ITimeSlot[] = [];
//     const [startHour, startMin] = template.startTime.split(':').map(Number);
//     const [endHour, endMin] = template.endTime.split(':').map(Number);

//     let currentSlotStart = new Date(date);
//     currentSlotStart.setHours(startHour, startMin, 0, 0);

//     const dayEnd = new Date(date);
//     dayEnd.setHours(endHour, endMin, 0, 0);

//     let sessionCount = 0;
//     const maxSessions = template.maxSessionsPerDay || Number.MAX_SAFE_INTEGER;

//     while (currentSlotStart < dayEnd && sessionCount < maxSessions) {
//       const slotEnd = new Date(currentSlotStart);
//       slotEnd.setMinutes(slotEnd.getMinutes() + template.sessionDuration);

//       if (slotEnd <= dayEnd) {
//         // Check if slot already exists
//         const existingSlot = await this.timeSlotModel.findOne({
//           trainerId: new Types.ObjectId(trainerId),
//           startTime: currentSlotStart,
//           endTime: slotEnd
//         }).exec();

//         if (!existingSlot) {
//           const slot = new this.timeSlotModel({
//             trainerId: new Types.ObjectId(trainerId),
//             date: new Date(date),
//             startTime: new Date(currentSlotStart),
//             endTime: new Date(slotEnd),
//             sessionType: 'fitness', // default
//             isBooked: false,
//             isBlocked: false,
//           });

//           slots.push(slot);
//           sessionCount++;
//         }
//       }

//       // Add session duration + break duration for next slot
//       currentSlotStart.setMinutes(
//         currentSlotStart.getMinutes() + template.sessionDuration + (template.breakDuration || 15)
//       );
//     }

//     return slots;
//   }

//   async findSlotsByTrainerAndDateRange(
//     trainerId: string,
//     startDate: Date,
//     endDate: Date
//   ): Promise<ITimeSlot[]> {
//     return await this.timeSlotModel
//       .find({
//         trainerId: new Types.ObjectId(trainerId),
//         date: { $gte: startDate, $lte: endDate }
//       })
//       .sort({ startTime: 1 })
//       .exec();
//   }

//   async updateSlot(id: string, data: Partial<ITimeSlot>): Promise<ITimeSlot | null> {
//     return await this.timeSlotModel
//       .findByIdAndUpdate(id, data, { new: true })
//       .exec();
//   }

//   async deleteSlot(id: string): Promise<boolean> {
//     const result = await this.timeSlotModel.findByIdAndDelete(id).exec();
//     return !!result;
//   }

//   async blockSlot(id: string): Promise<ITimeSlot | null> {
//     return await this.timeSlotModel
//       .findByIdAndUpdate(id, { isBlocked: true }, { new: true })
//       .exec();
//   }

//   async unblockSlot(id: string): Promise<ITimeSlot | null> {
//     return await this.timeSlotModel
//       .findByIdAndUpdate(id, { isBlocked: false }, { new: true })
//       .exec();
//   }
// }
