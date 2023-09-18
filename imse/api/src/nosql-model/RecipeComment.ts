import { v4 as uuidv4 } from 'uuid';
import { prop, Ref } from '@typegoose/typegoose';

import { User } from '.';

export class RecipeComment {
  @prop({ default: () => uuidv4() })
  _id: string;

  @prop()
  text: string;

  @prop({ ref: () => User, type: String })
  user: Ref<User>;

  @prop({ default: Date.now() })
  createdAt: Date;
}
