import { Inject, Injectable } from '@nestjs/common';

import * as infrastructure from '@/infrastructure';
import * as entities from '@/entity';
import * as repositories from '@/repository';

@Injectable()
export class UserFriendService {
  constructor(
    @infrastructure.InjectRepository(entities.UserFriend)
    private readonly friendRepository: repositories.AbstractUserFriendRepository,
    @infrastructure.InjectRepository(entities.User)
    private readonly userRepository: repositories.AbstractUserRepository,
  ) { }

  async getFriends(user: entities.User): Promise<entities.UserFriendFull[]> {
    const friends = await this.friendRepository.findFriendsForUser(user.id);

    return Promise.all(friends.map(async (f) => {
      const friend = await this.userRepository.findById(f.friendId);
      return { friend: {
        id: friend!.id,
        username: friend!.username
      }, role: f.role, isAccepted: f.isAccepted };
    }))
  }
}
