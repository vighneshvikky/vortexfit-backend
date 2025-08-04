// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   Query,
//   UseGuards,
//   Request,
//   ForbiddenException
// } from '@nestjs/common';
// // import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
// // import { IAvailabilityService } from '../interfaces/availability-service.interface';
// // import { CreateAvailabilityDto, UpdateAvailabilityDto, CreateSpecificSlotDto } from '../dto';
// import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
// // import { TrainerGuard } from '../../../guards/trainer.guard';

// @Controller('trainers/:trainerId/availability')
// export class AvailabilityController {
//   constructor(
//     private readonly availabilityService: IAvailabilityService,
//   ) {}

//   @Post('templates')
//   async createAvailabilityTemplate(
//     @Param('trainerId') trainerId: string,
//     @Body() createAvailabilityDto: CreateAvailabilityDto,
//     @Request() req: any
//   ) {
//     // Ensure trainer can only manage their own availability
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.createAvailabilityTemplate(
//       trainerId,
//       createAvailabilityDto
//     );
//   }

//   @Get('templates')
//   async getAvailabilityTemplates(
//     @Param('trainerId') trainerId: string,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.getTrainerAvailability(trainerId);
//   }

//   @Put('templates/:templateId')
//   async updateAvailabilityTemplate(
//     @Param('trainerId') trainerId: string,
//     @Param('templateId') templateId: string,
//     @Body() updateAvailabilityDto: UpdateAvailabilityDto,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.updateAvailabilityTemplate(
//       trainerId,
//       templateId,
//       updateAvailabilityDto
//     );
//   }

//   @Delete('templates/:templateId')
//   async deleteAvailabilityTemplate(
//     @Param('trainerId') trainerId: string,
//     @Param('templateId') templateId: string,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     await this.availabilityService.deleteAvailabilityTemplate(trainerId, templateId);
//     return { message: 'Template deleted successfully' };
//   }

//   @Post('slots/specific')
//   async createSpecificSlot(
//     @Param('trainerId') trainerId: string,
//     @Body() createSpecificSlotDto: CreateSpecificSlotDto,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.createSpecificSlot(trainerId, createSpecificSlotDto);
//   }

//   @Post('slots/generate')
//   async generateSlots(
//     @Param('trainerId') trainerId: string,
//     @Query('startDate') startDate: string,
//     @Query('endDate') endDate: string,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.generateSlots(
//       trainerId,
//       new Date(startDate),
//       new Date(endDate)
//     );
//   }

//   @Get('slots')
//   async getTrainerSlots(
//     @Param('trainerId') trainerId: string,
//     @Query('startDate') startDate: string,
//     @Query('endDate') endDate: string,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.getTrainerSlots(
//       trainerId,
//       new Date(startDate),
//       new Date(endDate)
//     );
//   }

//   @Put('slots/:slotId/block')
//   async blockTimeSlot(
//     @Param('trainerId') trainerId: string,
//     @Param('slotId') slotId: string,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.blockTimeSlot(trainerId, slotId);
//   }

//   @Put('slots/:slotId/unblock')
//   async unblockTimeSlot(
//     @Param('trainerId') trainerId: string,
//     @Param('slotId') slotId: string,
//     @Request() req: any
//   ) {
//     if (req.user.id !== trainerId && req.user.role !== 'admin') {
//       throw new ForbiddenException('Not authorized');
//     }

//     return await this.availabilityService.unblockTimeSlot(trainerId, slotId);
//   }
// }
