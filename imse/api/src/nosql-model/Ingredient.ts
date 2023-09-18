import { v4 as uuidv4 } from 'uuid';
import { Ref, index, prop } from '@typegoose/typegoose';

import { Recipe } from '.';

@index({ type: 'text' })
export class Ingredient {
  @prop({ default: () => uuidv4() })
  _id: string;

  @prop()
  name: string;

  @prop()
  type: string;

  @prop({ ref: () => Recipe, type: String })
  recipes: Ref<Recipe>[];
}
