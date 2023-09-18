import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as entities from '@/entity';
import * as sqlModels from '@/sql-model';

import { AbstractIngredientRepository } from './AbstractIngredientRepository';
import { RecipeIngredient } from './types';

export class SqlIngredientRepository extends AbstractIngredientRepository {
  constructor(@InjectRepository(sqlModels.Ingredient) private readonly ingredientRepository: Repository<sqlModels.Ingredient>) {
    super();
  }
  
  public find(): Promise<entities.Ingredient[]> {
    return this.ingredientRepository.find({ order: { id: 'ASC' } });
  }

  public save(params: Partial<entities.Ingredient>): Promise<entities.Ingredient> {
    return this.ingredientRepository.save(params);
  }

  public getRecipeIngredients(ingredientType?: string): Promise<RecipeIngredient[]> {
    return this.ingredientRepository.manager.query<RecipeIngredient[]>(`
      select
          i.id "iId",
          i.name "iName",
          i.type "iType",
          (
            select ri.recipe_id as id from recipe_ingredient ri
            left join recipe_comment c on c.recipe_id = ri.recipe_id
            where ri.ingredient_id = i.id
            group by ri.recipe_id
            order by count(c.id) desc, ri.recipe_id asc
            limit 1
          ) "recipeId"
      from ingredient i
      where i.type like '%'||$1||'%'
    `, [ingredientType ?? '']);
  }

  public async delete(): Promise<void> {
    await this.ingredientRepository.delete({});
  }
}
