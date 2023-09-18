import { Cuisine } from '@/entity';

export interface GetReportParams {
  userId: string;
  count: number;
}

export interface ReportItem extends Cuisine {
  likedFriendsCount: number;
  recipeCount: number;
}