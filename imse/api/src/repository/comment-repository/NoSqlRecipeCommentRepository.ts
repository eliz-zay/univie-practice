import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';

import * as entities from '@/entity';
import * as nosqlModels from '@/nosql-model';

import { AbstractRecipeCommentRepository } from './AbstractRecipeCommentRepository';
import { CreateCommentParams } from './types';

export class NoSqlRecipeCommentRepository extends AbstractRecipeCommentRepository {
  private readonly recipeModel: ReturnModelType<typeof nosqlModels.Recipe>;

  constructor() {
    super();

    this.recipeModel = getModelForClass(nosqlModels.Recipe);
  }

  public async save(params: CreateCommentParams): Promise<entities.RecipeComment> {
    const result = await this.recipeModel.findOneAndUpdate({ _id: params.recipe.id }, { $push: { comments: { text: params.text, user: params.user.id } } });

    return {
      id: result!.comments.pop()!._id,
      user: params.user,
      text: params.text,
      createdAt: new Date()
    };
  }
}
