import { UserFriend } from '.';

export class User {
  id: string;
  username: string;
  friends?: UserFriend[];
}
