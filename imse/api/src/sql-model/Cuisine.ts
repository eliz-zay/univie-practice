import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Recipe, User } from '.';

@Entity()
export class Cuisine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.likedCuisines)
  likedByUsers: User[];

  @ManyToMany(() => Recipe, (recipe) => recipe.cuisines)
  recipes: Recipe[];
}
