import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Cuisine, RecipeComment, RecipeIngredient } from '@/sql-model';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Cuisine, (cuisine) => cuisine.recipes)
  @JoinTable({
    joinColumn: { name: 'recipe_id' },
    inverseJoinColumn: { name: 'cuisine_id' },
  })
  cuisines: Cuisine[];

  @OneToMany(() => RecipeComment, (comment) => comment.recipe)
  comments: RecipeComment[];

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe)
  ingredientAmounts: RecipeIngredient[];
}
