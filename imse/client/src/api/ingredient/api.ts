import api from "../../api";
import { IngredientDTO } from "./IngredientDTO";

export async function getIngredients(token: string): Promise<IngredientDTO[]> {
  const response = await api.get("/ingredient", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}