import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';

import * as entities from '@/entity';
import * as nosqlModels from '@/nosql-model';

import { AbstractUserRepository } from './AbstractUserRepository';

export class NoSqlUserRepository extends AbstractUserRepository {
  private readonly userModel: ReturnModelType<typeof nosqlModels.User>;

  constructor() {
    super();

    this.userModel = getModelForClass(nosqlModels.User);
  }

  public async create(params: Partial<entities.User>): Promise<entities.User> {
    const userToCreate: Partial<nosqlModels.User> = {
      _id: params.id,
      username: params.username,
      friends: params.friends ?? [],
    };

    const user = await this.userModel.create(userToCreate);

    return {
      id: user._id,
      username: user.username,
      friends: params.friends ?? [],
    };
  }

  public async find(): Promise<entities.User[]> {
    const users = await this.userModel.find().sort({ _id: 'asc' }).exec();

    return users.map((user) => ({
      id: user._id,
      username: user.username,
      password: user.password,
      friends: user.friends,
    }));
  }

  public async findById(id: string): Promise<entities.User | null> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      username: user.username,
      friends: user.friends,
    };
  }

  public async findByUsername(username: string): Promise<entities.User | null> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      username: user.username,
      friends: user.friends,
    };
  }

  public async delete(): Promise<void> {
    await this.userModel.deleteMany();
  }
}
