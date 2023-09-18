import api from "../../api";
import { RecipeDTO } from "./RecipeDTO";

export async function getRecipes(token: string): Promise<RecipeDTO[]> {
  const response = await api.get("/recipe", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
