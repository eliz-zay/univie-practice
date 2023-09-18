import { Inject, Injectable, forwardRef } from '@nestjs/common';

import * as infrastructure from '@/infrastructure';
import * as repositories from '@/repository';
import * as entities from '@/entity';
import * as services from '@/service';

import * as types from '@/service/IngredientService.types';

@Injectable()
export class IngredientService {
  constructor(
    @infrastructure.InjectRepository(entities.Ingredient) private readonly ingredientRepository: repositories.AbstractIngredientRepository,
    @Inject(forwardRef(() => services.RecipeService)) private readonly recipeService: services.RecipeService
  ) { }

  async getIngredients() {
    return this.ingredientRepository.find();
  }

  async getReport({ ingredientType }: types.IntredientReportParams): Promise<types.IngredientReportItem[]> {
    const ingredientsRaw = await this.ingredientRepository.getRecipeIngredients(ingredientType);

    const recipeIds = ingredientsRaw.map((item) => item.recipeId);
    const recipes = await this.recipeService.getSummaryByIds(recipeIds);

    const reportItems: types.IngredientReportItem[] = ingredientsRaw.map((i) => {
      const ingredient: entities.Ingredient = {
        id: i.iId,
        name: i.iName,
        type: i.iType,
      };

      if (!i.recipeId) {
        return {
          ingredient,
          popularRecipe: null,
          recipeLastComment: null,
          recipeCommentCount: 0,
        };
      }

      const recipe = recipes.find((r) => r.recipe.id === i.recipeId)!;

      return {
        ingredient,
        popularRecipe: {
          id: recipe.recipe.id,
          name: recipe.recipe.name,
          description: recipe.recipe.description,
        },
        recipeLastComment: recipe.lastComment,
        recipeCommentCount: recipe.commentCount,
      };
    });

    const sortedItems = reportItems.sort((a, b) => b.recipeCommentCount - a.recipeCommentCount);

    return sortedItems;
  }
}
