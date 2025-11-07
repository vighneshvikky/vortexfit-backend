import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
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
@UseGuards(RolesGuard, NotBlockedGuard)
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
    @Query('limit') limit: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;

    return await this._bookingService.getBookings(
      trainerId,
      pageNumber,
      limitNumber,
    );
  }

  @UseGuards(RolesGuard, NotBlockedGuard)
  @Get('getUserBookings')
  async getUserBookings(
    @GetUser('sub') userId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;

    return await this._bookingService.getUserBookings(
      userId,
      pageNumber,
      limitNumber,
    );
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

    const { bookings, totalRecords } =
      await this._bookingService.getFilteredBookings(trainerId, {
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

  @Get('getUserFilteredBookings')
  async getUserFilteredBookings(
    @GetUser('sub') userId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() filters: BookingFilterDto,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const { bookings, totalRecords } =
      await this._bookingService.getUserFilteredBookings(userId, {
        ...filters,
        page: pageNumber,
        limit: limitNumber,
      });

    return { bookings, totalRecords }; 
  }

  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this._bookingService.cancelBooking(id, userId);
  }
}
