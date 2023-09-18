import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as entities from '@/entity';
import * as sqlModels from '@/sql-model';

import { AbstractUserRepository } from './AbstractUserRepository';

export class SqlUserRepository extends AbstractUserRepository {
  constructor(@InjectRepository(sqlModels.User) private readonly userRepository: Repository<sqlModels.User>) {
    super();
  }

  public async create(params: Partial<entities.User>): Promise<entities.User> {
    const user = await this.userRepository.save(params);

    return {
      id: user.id,
      username: user.username,
      friends: []
    };
  }

  public async find(): Promise<entities.User[]> {
    const users = await this.userRepository.find({
      relations: { initiatedFriends: true, receivedFriends: true },
      order: { id: 'asc' }
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      friends: [
        ...user.initiatedFriends.map((friend) => ({ friendId: friend.receiverId, role: entities.FriendRoleEnum.Initiator, isAccepted: friend.isAccepted })),
        ...user.receivedFriends.map((friend) => ({ friendId: friend.initiatorId, role: entities.FriendRoleEnum.Acceptor, isAccepted: friend.isAccepted }))
      ]
    }));
  }

  public async findById(id: string): Promise<entities.User | null> {
    const user = await this.userRepository.findOne({ where: { id }, relations: { initiatedFriends: true, receivedFriends: true } });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      friends: [
        ...user.initiatedFriends.map((friend) => ({ friendId: friend.receiverId, role: entities.FriendRoleEnum.Initiator, isAccepted: friend.isAccepted })),
        ...user.receivedFriends.map((friend) => ({ friendId: friend.initiatorId, role: entities.FriendRoleEnum.Acceptor, isAccepted: friend.isAccepted }))
      ]
    };
  }

  public async findByUsername(username: string): Promise<entities.User | null> {
    const user = await this.userRepository.findOne({ where: { username }, relations: { initiatedFriends: true, receivedFriends: true } });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      friends: [
        ...user.initiatedFriends.map((friend) => ({ friendId: friend.receiverId, role: entities.FriendRoleEnum.Initiator, isAccepted: friend.isAccepted })),
        ...user.receivedFriends.map((friend) => ({ friendId: friend.initiatorId, role: entities.FriendRoleEnum.Acceptor, isAccepted: friend.isAccepted }))
      ]
    };
  }

  public async delete(): Promise<void> {
    await this.userRepository.delete({});
  }
}
