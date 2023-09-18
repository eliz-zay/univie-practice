import * as entities from '@/entity';

import { CreateCommentParams } from './types';

export abstract class AbstractRecipeCommentRepository {
  public abstract save(params: CreateCommentParams): Promise<entities.RecipeComment>;
}
