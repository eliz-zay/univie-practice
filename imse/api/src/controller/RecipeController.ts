import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import * as services from '@/service';
import * as entities from '@/entity';

@UseGuards(AuthGuard('jwt'))
@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: services.RecipeService) {}

  @Get()
  async getRecipes(): Promise<entities.Recipe[]> {
    return this.recipeService.getRecipes();
  }
}
