import * as entities from '@/entity';

export abstract class AbstractUserFriendRepository {
  public abstract findFriendsForUser(id: string): Promise<entities.UserFriend[]>;
}
