import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Recipe, Ingredient } from '@/sql-model';

@Entity({ name: 'recipe_ingredient' })
export class RecipeIngredient {
  @ManyToOne(() => Recipe, (r) => r.ingredientAmounts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @PrimaryColumn({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

  @ManyToOne(() => Ingredient, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @PrimaryColumn({ name: 'ingredient_id', type: 'uuid' })
  ingredientId: string;

  @Column({ type: 'int' })
  amount: number;
}
