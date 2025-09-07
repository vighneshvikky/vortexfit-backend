import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { NotBlockedGuard } from 'src/common/guards/notBlocked.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  BOOKING_SERVICE,
  IBookingService,
} from '../services/interface/booking-service.interface';
import {
  BookingFilterDto,
  ChangeBookingStatusDto,
} from '../dtos/booking-dto.interface';

@Controller('bookings')
export class BookingController {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly _bookingService: IBookingService,
  ) {}
@UseGuards(RolesGuard, NotBlockedGuard)
@Get('getBookings')
async getBookings(
  @GetUser('sub') trainerId: string,
  @Query('page') page: string,
  @Query('limit') limit: string
) {

  console.log('limit', limit);
  console.log('page', page)
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 5;

  return await this._bookingService.getBookings(trainerId, pageNumber, limitNumber);
}


@Get('getFilteredBookings')
async getFilteredBookings(
  @GetUser('sub') trainerId: string,
  @Query('page') page: string,
  @Query('limit') limit: string,
  @Query() filters: BookingFilterDto,
) {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 5;

  const { bookings, totalRecords } = await this._bookingService.getFilteredBookings(trainerId, {
    ...filters,
    page: pageNumber,
    limit: limitNumber,
  });

  return { bookings, totalRecords }; 
}

  @UseGuards(RolesGuard, NotBlockedGuard)
  @Patch('changeStatus')
  async changeStatus(@Body() dto: ChangeBookingStatusDto) {
    return await this._bookingService.changeStatus(
      dto.bookingId,
      dto.bookingStatus,
    );
  }
}
