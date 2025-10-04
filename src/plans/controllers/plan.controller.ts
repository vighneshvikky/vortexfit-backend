import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Plan } from '../schema/plan.schema';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import {
  IPlanService,
  IPLANSERVICE,
} from '../services/interface/plan.service.interface';
import { CreatePlanDto } from '../dtos/plan.dto';

@Controller('plans')
export class PlanController {
  constructor(
    @Inject(IPLANSERVICE) private readonly _planService: IPlanService,
  ) {}

  @Post('create')
  async create(@Body() body: CreatePlanDto) {
    console.log('data from the frontend for creating plan', body);
    return this._planService.createPlan(body);
  }

  @Get('userPlan')
  async userPlan(@GetUser('role') role: string) {
    return this._planService.getUserPlan(role);
  }

  @Get()
  async findAll() {
    return this._planService.getAllPlans();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._planService.getPlanById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Plan>) {
    return this._planService.updatePlan(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this._planService.delete(id);
  }
}
