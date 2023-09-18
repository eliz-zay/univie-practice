import { prop } from '@typegoose/typegoose';

export enum FriendRoleEnum {
  Initiator = 'Initiator',
  Acceptor = 'Acceptor'
}

export class UserFriend {
  @prop()
  friendId: string;

  @prop({ enum: FriendRoleEnum })
  role: FriendRoleEnum;

  @prop()
  isAccepted: boolean;
}
