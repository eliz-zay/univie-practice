import { Cuisine, RecipeComment, RecipeIngredient } from '.';

export class Recipe {
  id: string;
  name: string;
  description: string;
  cuisines: Cuisine[];
  comments: RecipeComment[];
  ingredientAmounts: RecipeIngredient[];
}
