import { CommentDTO } from "../comment/CommentDTO";
import { IngredientDTO } from "../report-1/IngredientDTO";

export type RecipeIngredientDTO = {
  ingredient: IngredientDTO;
  amount: number;
};