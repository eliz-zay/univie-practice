import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as sqlModels from '@/sql-model';
import * as entities from '@/entity';

import { AbstractUserFriendRepository } from './AbstractUserFriendRepository';

export class SqlUserFriendRepository extends AbstractUserFriendRepository {
  constructor(@InjectRepository(sqlModels.UserFriend) private readonly friendRepository: Repository<sqlModels.UserFriend>) {
    super();
  }

  public async findFriendsForUser(id: string): Promise<entities.UserFriend[]> {
    const friends = await this.friendRepository.find({
      where: [
        { initiatorId: id },
        { receiverId: id }
      ]
    });

    return friends.map((friend) => ({
      friendId: friend.initiatorId === id ? friend.receiverId : friend.initiatorId,
      role: friend.initiatorId === id ? entities.FriendRoleEnum.Initiator : entities.FriendRoleEnum.Acceptor,
      isAccepted: friend.isAccepted
    }));
  }
}
