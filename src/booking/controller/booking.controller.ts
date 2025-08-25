import { Body, Controller, Get, Inject, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { NotBlockedGuard } from 'src/common/guards/notBlocked.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  BOOKING_SERVICE,
  IBookingService,
} from '../services/interface/booking-service.interface';
;

@Controller('bookings')
export class BookingController {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly bookingService: IBookingService,
  ) {}
  @UseGuards(RolesGuard, NotBlockedGuard)
  @Get('getBookings')
  async getBookings(@GetUser('sub') trainerId: string) {
    return await this.bookingService.getBookings(trainerId);
  }
 @UseGuards(RolesGuard, NotBlockedGuard)
 @Patch('changeStatus')
 async changeStatus(@Body() dto: any){
    console.log('dto', dto)
    return await this.bookingService.changeStatus(dto.bookingId, dto.bookingStatus);
 }
  
}
