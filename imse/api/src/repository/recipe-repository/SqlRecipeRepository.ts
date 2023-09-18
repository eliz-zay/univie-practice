import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import * as entities from '@/entity';
import * as sqlModels from '@/sql-model';

import { AbstractRecipeRepository } from './AbstractRecipeRepository';

export class SqlRecipeRepository extends AbstractRecipeRepository {
  constructor(@InjectRepository(sqlModels.Recipe) private readonly recipeRepository: Repository<sqlModels.Recipe>) {
    super();
  }

  public async find(ids?: string[]): Promise<entities.Recipe[]> {
    const recipes = await this.recipeRepository.find({
      where: ids ? { id: In(ids) } : {},
      relations: {
        comments: {
          user: true
        },
        ingredientAmounts: {
          ingredient: true,
        },
        cuisines: true
      },
    });

    return recipes.map((recipe) => ({ ...recipe, comments: recipe.comments.map((comment) => ({ ...comment, user: { id: comment.user.id, username: comment.user.username } })) }));
  }

  public findById(id: string): Promise<entities.Recipe | null> {
    return this.recipeRepository.findOne({ where: { id } });
  }

  public save(params: Partial<entities.Recipe>): Promise<entities.Recipe> {
    return this.recipeRepository.save(params);
  }

  public async delete(): Promise<void> {
    await this.recipeRepository.delete({});
  }
}
