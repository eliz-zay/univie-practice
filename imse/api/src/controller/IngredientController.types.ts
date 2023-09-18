import * as entities from '@/entity';

export class IngredientReportItemParams {
  ingredient: entities.Ingredient;
  popularRecipe: { id: string; name: string; description: string; } | null;
  recipeLastComment: entities.RecipeComment | null;
  recipeCommentCount: number;
}

export class GetIntredientReportParams {
  ingredientType?: string;
}
