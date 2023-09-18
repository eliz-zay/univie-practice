import { prop, Ref } from '@typegoose/typegoose';

import { Ingredient } from '.';

export class RecipeIngredient {
  @prop({ ref: () => Ingredient, type: String })
  ingredient: Ref<Ingredient>;

  @prop()
  amount: number;
}
