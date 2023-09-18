import api from "../../api";
import { CuisineDTO } from "./CuisineDTO";

export async function getCuisines(token: string): Promise<CuisineDTO[]> {
  const response = await api.get("/cuisine", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export function postToggleLike(id: string, token: string): Promise<void> {
  return api.post(`/cuisine/${id}/like-toggle`, null, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}