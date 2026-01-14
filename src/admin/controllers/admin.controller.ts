import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Query,
  Patch,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { GetUnverifiedTrainersQueryDto } from 'src/common/helpers/dtos/get-user-query.dto';
import { BadRequestException } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { setTokenCookies } from 'src/common/helpers/token.setter';
import { LoginAdminDto } from 'src/auth/dto/admin.dto';
import { UserQueryDto } from '../dtos/user-query.dto';

import {
  ADMIN_SERVICE,
  IAdminService,
} from '../services/interface/admin-service.interface';
import { AdminUserDto } from '../dtos/admin-user.dto';
import { UserFilter } from '../enums/admin.enums';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(ADMIN_SERVICE) private readonly adminService: IAdminService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginAdminDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.adminService.verifyAdminLogin(
        loginDto.email,
        loginDto.password,
      );

    setTokenCookies(response, accessToken, refreshToken);
    const adminId = process.env.ADMIN_ID;
    return {
      message: 'Admin login successful',
      data: {
        _id: process.env.ADMIN_ID,
        email: loginDto.email,
        role: adminId,
      },
    };
  }

  @Get('users')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getUsers(
    @Query()
    query: UserQueryDto & {
      filter?: UserFilter.USER | UserFilter.TRAINER | UserFilter.BLOCKED;
    },
  ) {
    const { page = '1',  ...rest } = query;
    return this.adminService.getUsers({
      ...rest,
      page: parseInt(page),
      filter: query.filter,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('listTrainers')
  async listTrainers(@Query() query: GetUnverifiedTrainersQueryDto) {
    return await this.adminService.getUnverifiedTrainers(query);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('verify-trainer/:trainerId')
  async approveTrainer(@Param('trainerId') trainerId: string) {
    return this.adminService.approveTrainer(trainerId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('reject-trainer/:trainerId')
  async rejectTrainer(
    @Param('trainerId') trainerId: string,
    @Body('reason') reason: string,
  ) {
    if (!reason || reason.trim() === '') {
      throw new BadRequestException('Rejection reason is required');
    }

    return this.adminService.rejectTrainer(trainerId, reason);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('users/:id/toggle-block')
  async toggleBlockStatus(
    @Param('id') id: string,
    @Query('role') role: 'user' | 'trainer',
  ): Promise<AdminUserDto> {
    return await this.adminService.toggleBlockStatus(id, role);
  }
}
