import { CommentDTO } from "../comment/CommentDTO";
import { RecipeIngredientDTO } from "./RecipeIngredientDTO";

export type RecipeDTO = {
  id: string;
  name: string;
  description: string;
  comments: CommentDTO[];
  ingredientAmounts: RecipeIngredientDTO[];
};