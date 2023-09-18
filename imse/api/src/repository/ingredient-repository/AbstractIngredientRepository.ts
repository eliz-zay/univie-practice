import * as entities from '@/entity';

import { RecipeIngredient } from './types';

export abstract class AbstractIngredientRepository {
  public abstract find(): Promise<entities.Ingredient[]>;
  public abstract save(params: Partial<entities.Ingredient>): Promise<entities.Ingredient>;
  public abstract getRecipeIngredients(ingredientType?: string): Promise<RecipeIngredient[]>;
  public abstract delete(): Promise<void>;
}
