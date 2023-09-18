import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';

import * as entities from '@/entity';
import * as nosqlModels from '@/nosql-model';

import { AbstractRecipeRepository } from './AbstractRecipeRepository';

export class NoSqlRecipeRepository extends AbstractRecipeRepository {
  private readonly recipeModel: ReturnModelType<typeof nosqlModels.Recipe>;
  private readonly cuisineModel: ReturnModelType<typeof nosqlModels.Cuisine>;
  private readonly ingredientModel: ReturnModelType<typeof nosqlModels.Ingredient>;

  constructor() {
    super();

    this.recipeModel = getModelForClass(nosqlModels.Recipe);
    this.cuisineModel = getModelForClass(nosqlModels.Cuisine);
    this.ingredientModel = getModelForClass(nosqlModels.Ingredient);
  }

  public async save(params: Partial<entities.Recipe>): Promise<entities.Recipe> {
    const recipeToCreate: Partial<nosqlModels.Recipe> = {
      _id: params.id,
      name: params.name,
      description: params.description,
      comments: params.comments ? params.comments.map((comment) => ({ _id: comment.id, text: comment.text, user: comment.user.id, createdAt: comment.createdAt })) : [],
      ingredientAmounts: params.ingredientAmounts ? params.ingredientAmounts.map((item) => ({ amount: item.amount, ingredient: item.ingredient.id })) : [],
      cuisines: params.cuisines ? params.cuisines.map((cuisine) => cuisine.id) : []
    };

    const recipe = await this.recipeModel.create(recipeToCreate);

    if (recipeToCreate?.cuisines?.length) {
      await this.cuisineModel.updateMany({ _id: { "$in": recipeToCreate.cuisines } }, { $push: { recipes: recipe } });
    }
    if (recipeToCreate?.ingredientAmounts?.length) {
      const ingredients = recipeToCreate.ingredientAmounts.map((ia) => ia.ingredient);
      await this.ingredientModel.updateMany({ _id: { "$in": ingredients } }, { $push: { recipes: recipe } });
    }

    return {
      id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      comments: params.comments ?? [],
      ingredientAmounts: params.ingredientAmounts ?? [],
      cuisines: params.cuisines ?? []
    };
  }

  public async find(ids?: string[]): Promise<entities.Recipe[]> {
    const baseQuery = ids ? this.recipeModel.find({ _id: { '$in': ids } }) : this.recipeModel.find();
    const recipes = await baseQuery
      .sort({ _id: 'asc' })
      .populate({ path: 'cuisines', model: nosqlModels.Cuisine.name })
      .populate({ path: 'ingredientAmounts', populate: { path: 'ingredient', model: nosqlModels.Ingredient.name } })
      .populate({ path: 'comments', populate: { path: 'user', model: nosqlModels.User.name } })
      .exec();

    return recipes.map((recipe) => ({
      id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      comments: recipe.comments.map((comment) => {
        const user = comment.user as nosqlModels.User;
        return {
          id: comment._id,
          text: comment.text,
          user: {
            id: user._id,
            username: user.username
          },
          createdAt: comment.createdAt
        };
      }) as entities.RecipeComment[],
      ingredientAmounts: recipe.ingredientAmounts.map((item) => {
        const ingredient = item.ingredient as nosqlModels.Ingredient;
        return {
          amount: item.amount,
          ingredient: {
            id: ingredient._id,
            name: ingredient.name,
            type: ingredient.type
          }
        }
      }),
      cuisines: (recipe.cuisines as nosqlModels.Cuisine[]).map((cuisine) => ({
        id: cuisine._id,
        country: cuisine.country,
        description: cuisine.description
      })),
    }));
  }

  public async findById(id: string): Promise<entities.Recipe | null> {
    const recipe = await this.recipeModel.findById(id)
      .populate({ path: 'cuisines', model: nosqlModels.Cuisine.name })
      .populate({ path: 'ingredientAmounts', populate: { path: 'ingredient', model: nosqlModels.Ingredient.name } })
      .populate({ path: 'comments', populate: { path: 'user', model: nosqlModels.User.name } })
      .exec();

    if (!recipe) {
      return null;
    }

    return {
      id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      comments: recipe.comments.map((comment) => ({ id: comment._id, text: comment.text, user: comment.user, createdAt: comment.createdAt })) as entities.RecipeComment[],
      ingredientAmounts: recipe.ingredientAmounts as entities.RecipeIngredient[],
      cuisines: recipe.cuisines as unknown as entities.Cuisine[],
    };
  }

  public async delete(): Promise<void> {
    await this.recipeModel.deleteMany();
  }
}
