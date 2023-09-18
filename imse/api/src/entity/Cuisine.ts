import { Recipe } from '@/sql-model';
import { User } from '.';

export class Cuisine {
  id: string;
  country: string;
  description: string;
  likedByUsers?: User[];
  recipes?: Recipe[];
}
