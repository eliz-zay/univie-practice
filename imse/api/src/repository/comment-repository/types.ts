import * as entities from '@/entity';

export interface CreateCommentParams {
  user: entities.User;
  text: string;
  recipe: entities.Recipe;
}
