import { User } from '.';

export class RecipeComment {
  id: string
  text: string;
  user: User;
  createdAt: Date;
}
