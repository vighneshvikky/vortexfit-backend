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
import { UpdateUserDto } from '../dtos/user.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { NotBlockedGuard } from 'src/common/guards/notBlocked.guard';
import {
  IUserService,
  USER_SERVICE,
} from '../interfaces/user-service.interface';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}
  @UseGuards(JwtAuthGuard, RolesGuard, NotBlockedGuard)
  @Roles('user')
  @Patch('update-profile')
  async updateUser(
    @GetUser('sub') userId: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return await this.userService.findByIdAndUpdate(userId, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, NotBlockedGuard)
  @Roles('user')
  @Get('approved-trainer')
  async getApprovedTrainer(
    @Query('category') category?: string,
    @Query('name') name?: string,
  ): Promise<Trainer[]> {
    return await this.userService.findApprovedTrainer({ category, name });
  }

  @UseGuards(JwtAuthGuard, RolesGuard, NotBlockedGuard)
  @Roles('user')
  @Get('getTrainerData/:id')
  getTrainerData(@Param('id') id: string): Promise<Trainer | null> {
    return this.userService.findTrainer(id);
  }
}
