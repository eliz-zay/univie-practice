import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import * as services from '@/service';
import * as types from './IngredientController.types';
import * as entities from '@/entity';

@UseGuards(AuthGuard('jwt'))
@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: services.IngredientService) {}

  @Get()
  async getIngredients(): Promise<entities.Ingredient[]> {
    return this.ingredientService.getIngredients();
  }

  @Get('report')
  async getReport(@Query() query: types.GetIntredientReportParams): Promise<types.IngredientReportItemParams[]> {
    return this.ingredientService.getReport(query);
  }
}
