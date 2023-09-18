import { CuisineDTO } from "../cuisine/CuisineDTO";

export type ReportTwoDTO = {
  cuisine: CuisineDTO;
  likedFriendsCount: number;
  likedFriendsPercent: number;
  recipeCount: number;
}
