import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Cuisine, UserFriend } from '.';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => UserFriend, (friend) => friend.initiator)
  initiatedFriends: UserFriend[];

  @OneToMany(() => UserFriend, (friend) => friend.receiver)
  receivedFriends: UserFriend[];

  @ManyToMany(() => Cuisine, (cuisine) => cuisine.likedByUsers)
  @JoinTable({
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'cuisine_id' }
  })
  likedCuisines: Cuisine[];
}
