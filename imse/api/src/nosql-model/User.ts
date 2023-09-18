import { v4 as uuidv4 } from 'uuid';
import { index, prop } from '@typegoose/typegoose';

import { UserFriend } from '.';

@index({ username: 'text' })
export class User {
  @prop({ default: () => uuidv4() })
  _id: string;

  @prop()
  username: string;

  @prop()
  password: string;

  @prop()
  friends: UserFriend[];
}
