import { User } from '@/entity';

export interface CreateCommentParams {
  user: User;
  recipeId: string;
  text: string;
}
