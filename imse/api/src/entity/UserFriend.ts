import { User } from '.';

export enum FriendRoleEnum {
  Initiator = 'Initiator',
  Acceptor = 'Acceptor'
}

export class UserFriend {
  friendId: string;
  role: FriendRoleEnum;
  isAccepted: boolean;
}

export class UserFriendFull {
  friend: User;
  role: FriendRoleEnum;
  isAccepted: boolean;
}
