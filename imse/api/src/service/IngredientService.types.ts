import * as entities from '@/entity';

export class IngredientReportItem {
  ingredient: entities.Ingredient;
  popularRecipe: { id: string; name: string; description: string; } | null;
  recipeLastComment: entities.RecipeComment | null;
  recipeCommentCount: number;
}

export class IntredientReportParams {
  ingredientType?: string;
}
