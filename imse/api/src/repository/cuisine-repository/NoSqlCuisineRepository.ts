import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';

import * as entities from '@/entity';
import * as nosqlModels from '@/nosql-model';

import { AbstractCuisineRepository } from './AbstractCuisineRepository';
import { GetReportParams, ReportItem } from './types';

export class NoSqlCuisineRepository extends AbstractCuisineRepository {
  private readonly cuisineModel: ReturnModelType<typeof nosqlModels.Cuisine>;

  constructor() {
    super();

    this.cuisineModel = getModelForClass(nosqlModels.Cuisine);
  }

  public async save(params: Partial<entities.Cuisine>): Promise<entities.Cuisine> {
    const cuisineToCreate: Partial<nosqlModels.Cuisine> = {
      _id: params.id,
      country: params.country,
      description: params.description,
      likedByUsers: params.likedByUsers ? params.likedByUsers.map((user) => user.id) : [],
      recipes: []
    };

    const cuisine = await this.cuisineModel.create(cuisineToCreate);

    return {
      id: cuisine._id,
      country: cuisine.country,
      description: cuisine.description,
      likedByUsers: params.likedByUsers ?? []
    };
  }

  public async update(id: string, cuisine: Partial<entities.Cuisine>): Promise<void> {
    const toUpdate: Partial<nosqlModels.Cuisine> = { description: cuisine.description, country: cuisine.country };

    if (cuisine.likedByUsers) {
      toUpdate.likedByUsers = cuisine.likedByUsers.map((item) => item.id)
    }

    await this.cuisineModel.updateOne({ _id: id }, toUpdate);
  }

  public async find(): Promise<entities.Cuisine[]> {
    const cuisines = await this.cuisineModel
      .find()
      .sort({ _id: 'asc' })
      .populate({ path: 'likedByUsers', model: nosqlModels.User.name })
      .exec();

    return cuisines.map((cuisine) => ({
      id: cuisine._id,
      country: cuisine.country,
      description: cuisine.description,
      likedByUsers: (cuisine.likedByUsers as nosqlModels.User[]).map((user) => ({ id: user._id, username: user.username }))
    }));
  }

  public async findById(id: string): Promise<entities.Cuisine | null> {
    const cuisine = await this.cuisineModel.findById(id).populate({ path: 'likedByUsers', model: nosqlModels.User.name }).exec();
    if (!cuisine) {
      return null;
    }

    return {
      id: cuisine._id,
      country: cuisine.country,
      description: cuisine.description,
      likedByUsers: cuisine.likedByUsers as entities.User[],
    };
  }

  public getCuisineReport(params: GetReportParams): Promise<ReportItem[]> {
    // TODO
    throw new Error('Method not implemented.');
  }

  public async delete(): Promise<void> {
    await this.cuisineModel.deleteMany();
  }
}
