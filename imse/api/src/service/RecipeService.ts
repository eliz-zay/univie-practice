import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import * as infrastructure from '@/infrastructure';
import * as repositories from '@/repository';
import * as entities from '@/entity';

@Injectable()
export class RecipeService {
  constructor(
    @infrastructure.InjectRepository(entities.Recipe) private readonly recipeRepository: repositories.AbstractRecipeRepository,
  ) { }

  async getRecipe(id: string): Promise<entities.Recipe> {
    const recipe = await this.recipeRepository.findById(id);

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }

    return recipe;
  }

  async getRecipes(): Promise<entities.Recipe[]> {
    return this.recipeRepository.find();
  }

  async getSummaryByIds(ids: string[]): Promise<
    {
      recipe: entities.Recipe;
      lastComment: entities.RecipeComment | null;
      commentCount: number;
    }[]
  > {
    const recipes = await this.recipeRepository.find(ids);

    return recipes.map((recipe) => {
      if (!recipe.comments.length) {
        return { recipe, lastComment: null, commentCount: 0 };
      }

      const lastComment = recipe.comments.reduce(
        (last, current) =>
          current.createdAt > last.createdAt ? current : last,
        recipe.comments[0],
      );

      return { recipe, lastComment, commentCount: recipe.comments.length };
    });
  }
}
