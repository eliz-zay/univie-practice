import { v4 as uuidv4 } from 'uuid';
import { prop, Ref } from '@typegoose/typegoose';

import { Cuisine, RecipeComment, RecipeIngredient } from '.';

export class Recipe {
  @prop({ default: () => uuidv4() }) // built-in index
  _id: string;

  @prop()
  name: string;

  @prop()
  description: string;

  @prop({ ref: () => Cuisine, type: String })
  cuisines: Ref<Cuisine>[];

  @prop()
  comments: RecipeComment[];

  @prop()
  ingredientAmounts: RecipeIngredient[];
}
