import { v4 as uuidv4 } from 'uuid';
import { prop, Ref } from '@typegoose/typegoose';

import { User, Recipe } from '.';

export class Cuisine {
  @prop({ default: () => uuidv4() })
  _id: string;

  @prop()
  country: string;

  @prop()
  description: string;

  @prop({ ref: () => Recipe, type: String })
  recipes: Ref<Recipe>[];

  @prop({ ref: () => User, type: String })
  likedByUsers: Ref<User>[];
}
