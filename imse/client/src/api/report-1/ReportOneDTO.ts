import { CommentDTO } from "../comment/CommentDTO";
import { RecipeDTO } from "../recipe/RecipeDTO";
import { IngredientDTO } from "./IngredientDTO";

export type ReportOneDTO = {
  ingredient: IngredientDTO;
  popularRecipe: RecipeDTO;
  recipeLastComment: CommentDTO;
  recipeCommentCount: number;
}