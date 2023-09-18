import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';

import * as entities from '@/entity';
import * as nosqlModels from '@/nosql-model';

import { AbstractIngredientRepository } from './AbstractIngredientRepository';
import { RecipeIngredient } from './types';

export class NoSqlIngredientRepository extends AbstractIngredientRepository {
  private readonly ingredientModel: ReturnModelType<typeof nosqlModels.Ingredient>;
  private readonly recipeModel: ReturnModelType<typeof nosqlModels.Recipe>;

  constructor() {
    super();

    this.ingredientModel = getModelForClass(nosqlModels.Ingredient);
    this.recipeModel = getModelForClass(nosqlModels.Recipe);
  }

  public async save(params: Partial<entities.Ingredient>): Promise<entities.Ingredient> {
    const ingredientToCreate: Partial<nosqlModels.Ingredient> = {
      _id: params.id,
      name: params.name,
      type: params.type
    }

    const ingredient = await this.ingredientModel.create(ingredientToCreate);

    return {
      id: ingredient._id,
      name: ingredient.name,
      type: ingredient.type
    };
  }

  public async find(): Promise<entities.Ingredient[]> {
    const ingredients = await this.ingredientModel.find().sort({ _id: 'asc' });

    return ingredients.map((ingredient) => ({
      id: ingredient._id,
      name: ingredient.name,
      type: ingredient.type
    }));
  }

  public async getRecipeIngredients(ingredientType?: string): Promise<RecipeIngredient[]> {
    const filter = ingredientType ? { type: { $regex: `.*${ingredientType}.*` } } : {};

    const ingredients = await this.ingredientModel.aggregate([
      // Filter to match ingredient type
      {
        $match: filter
      },
      // Lookup to get the corresponding recipes for each ingredient
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipes',
          foreignField: '_id',
          as: 'recipes',
        },
      },
      // Unwind the recipes array to create a separate document for each ingredient-recipe pair
      { $unwind: '$recipes' },
      // Find the recipe with the most comments
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          type: { $first: '$type' },
          recipes: { $push: '$recipes' },
          maxComments: { $max: { $size: '$recipes.comments' } },
        },
      },
      // Filter to leave only recipe with the most comments
      {  
        $addFields: {
          recipes: {
            $filter: {
              input: '$recipes',
              cond: { $eq: [{ $size: '$$this.comments' }, '$maxComments'] },
            },
          },
        },
      },
      // Project only the necessary fields
      {
        $project: {
          _id: 1,
          name: 1,
          type: 1,
          recipes: { $arrayElemAt: ['$recipes', 0] },
        },
      },
    ]);

    return ingredients.map((ingredient) => ({
      iId: ingredient._id,
      iName: ingredient.name,
      iType: ingredient.type,
      recipeId: ingredient.recipes._id
    }));
  }

  public async delete(): Promise<void> {
    await this.ingredientModel.deleteMany();
  }
}
