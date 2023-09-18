import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoggedInRequest } from '@/jwt.strategy';
import * as services from '@/service';
import * as entities from '@/entity';
import * as types from './CuisineController.types';

@UseGuards(AuthGuard('jwt'))
@Controller('cuisine')
export class CuisineController {
  constructor(private cuisineService: services.CuisineService) {}

  @Get()
  async getCuisines(): Promise<entities.Cuisine[]> {
    return this.cuisineService.getCuisines();
  }

  @Post(':id/like-toggle')
  async toggleLike(
    @Req() req: LoggedInRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.cuisineService.toggleLike(req.user, id);
  }

  @Get('report')
  async getReport(@Query() query: types.GetCuisineReportParams): Promise<types.CuisineReportParams[]> {
    return this.cuisineService.getReport(query.username);
  }
}
