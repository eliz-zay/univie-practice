import { Cuisine } from '@/entity';

export class CuisineReportParams {
  cuisine: Cuisine;
  likedFriendsCount: number;
  likedFriendsPercent: number;
  recipeCount: number;
}

export class GetCuisineReportParams {
  username: string;
}