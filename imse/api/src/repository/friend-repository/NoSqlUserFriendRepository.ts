import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';

import * as entities from '@/entity';
import * as nosqlModels from '@/nosql-model';

import { AbstractUserFriendRepository } from './AbstractUserFriendRepository';

export class NoSqlUserFriendRepository extends AbstractUserFriendRepository {
  private readonly userModel: ReturnModelType<typeof nosqlModels.User>;

  constructor() {
    super();

    this.userModel = getModelForClass(nosqlModels.User);
  }

  public async findFriendsForUser(id: string): Promise<entities.UserFriend[]> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return [];
    }

    return user.friends;
  }
}
